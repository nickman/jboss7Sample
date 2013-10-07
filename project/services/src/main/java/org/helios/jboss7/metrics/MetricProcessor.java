/**
 * Helios, OpenSource Monitoring
 * Brought to you by the Helios Development Group
 *
 * Copyright 2007, Helios Development Group and individual contributors
 * as indicated by the @author tags. See the copyright.txt file in the
 * distribution for a full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org. 
 *
 */
package org.helios.jboss7.metrics;

import java.lang.management.ManagementFactory;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.helios.jboss7.hibernate.domain.Agent;
import org.helios.jboss7.hibernate.domain.Host;
import org.helios.jboss7.hibernate.domain.Metric;
import org.helios.jboss7.hibernate.domain.TraceType;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

/**
 * <p>Title: MetricProcessor</p>
 * <p>Description: Input metric processing endpoint</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.metrics.MetricProcessor</code></p>
 */

public class MetricProcessor implements InitializingBean, IMetricProcessor {
	/** the hibernate session factory */
	@Autowired(required=true)
	protected SessionFactory sessionFactory = null;
	/** the metric loader */
	@Autowired(required=true)
	protected MetricLoader metricLoader = null;
	
	/** Instance logger */
	protected final Logger log = Logger.getLogger(getClass());
	/** Metric host cache */
	protected LoadingCache<String, Host> hostCache;
	/** Metric agent cache */
	protected LoadingCache<String, Agent> agentCache;
	/** Metric cache */
	protected LoadingCache<String, Metric> metricCache;
	
	/** TraceType cache */
	protected final Map<Short, TraceType> traceTypeCache = new HashMap<Short, TraceType>(); 
	
	/** The core count for this JVM */
	public static final int CORES = ManagementFactory.getOperatingSystemMXBean().getAvailableProcessors();
	
	/** The in-state metric */
	private static final ThreadLocal<InputMetric> currentMetric = new ThreadLocal<InputMetric>(); 
	
	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.metrics.IMetricProcessor#process(java.lang.CharSequence)
	 */
	@Override
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public void process(CharSequence metricInstance) {
		if(metricInstance==null) throw new IllegalArgumentException("The passed metric instance was null");
		try {
			InputMetric metric = new InputMetric(metricInstance);
			log.info("Processing InputMetric [" + metric.toString() + "]");
			currentMetric.set(metric);
			log.info("Processing Host:" + hostCache.get(metric.host));
			log.info("Processing Agent:" + agentCache.get(metric.getAgentKey()));
			log.info("Processing Metric:" + metricCache.get(metric.getMetricKey()));
		} catch (Exception ex) {
			String msg = "Failed to process metric instance [" + metricInstance + "]";
			log.error(msg, ex);
			throw new RuntimeException(msg, ex);
		} finally {
			currentMetric.remove();
		}
	}
	/**
	 * {@inheritDoc}
	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		log.info("Configuring MetricProcessor Caches.....");
		for(TraceType t: metricLoader.getTraceTypes()) {
			traceTypeCache.put(t.getTypeId(), t);
		}
		hostCache = CacheBuilder.newBuilder()
				.concurrencyLevel(CORES * 2)
				.recordStats()
				.softValues()
				.build(new CacheLoader<String, Host>(){
					@Override
					public Host load(String key) throws Exception {
						String[] nameDomain = Host.splitHostName(key);
						Host host = metricLoader.loadHost(nameDomain[0], nameDomain[1]);
						if(host==null) {
							Date now = new Date();
														
							host = new Host(nameDomain[0], nameDomain[1], now, now, 1);
							host = metricLoader.save(host);
							log.info("Saved Host:\n\t" + host);							
						}						
						currentMetric.get().hostId = host.getHostId();
						return host;
					}					
				});
		agentCache = CacheBuilder.newBuilder()
				.concurrencyLevel(CORES * 2)
				.recordStats()
				.softValues()
				.build(new CacheLoader<String, Agent>(){
					@Override
					public Agent load(String key) throws Exception {
						Agent agent = metricLoader.loadAgent(currentMetric.get().agent, currentMetric.get().hostId);
						if(agent==null) {
							Date now = new Date();
							String[] nameDomain = Host.splitHostName(key);
							
							agent = new Agent(hostCache.getIfPresent(currentMetric.get().host), currentMetric.get().agent, now, now, (short)currentMetric.get().fragments.length);
							agent.setHost(hostCache.get(nameDomain[0] + ":" + nameDomain[1]));
							agent = metricLoader.save(agent);
							log.info("Saved Agent:\n\t" + agent);							
						}						
						currentMetric.get().agentId = agent.getAgentId();
						return agent;
					}					
				});
		metricCache = CacheBuilder.newBuilder()
				.concurrencyLevel(CORES * 2)
				.recordStats()
				.softValues()
				.build(new CacheLoader<String, Metric>(){
					@Override
					public Metric load(String key) throws Exception {
						Metric metric = metricLoader.loadMetric(currentMetric.get().namespace, currentMetric.get().agentId);
						if(metric==null) {
							Date now = new Date();
							InputMetric im = currentMetric.get();
							Agent agent = agentCache.get(im.getAgentKey());
							metric = new Metric(traceTypeCache.get(im.type), agentCache.get(im.getAgentKey()),
									im.namespace, im.fragments, im.fragments.length, im.name, now, (byte)1, now, null
							);
							metric.setAgent(agent);
							metric = metricLoader.save(metric);
							log.info("Saved Metric:\n\t" + metric);
							im.metricId = metric.getMetricId();

						}						
						return metric;
					}					
				});
 
		
		log.info("MetricProcessor Initialized");
	}
	

}
