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
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;

import org.apache.log4j.Logger;
import org.helios.jboss7.hibernate.domain.Agent;
import org.helios.jboss7.hibernate.domain.Host;
import org.helios.jboss7.hibernate.domain.Metric;
import org.helios.jboss7.hibernate.domain.TraceType;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

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
	protected Cache<String, Host> hostCache;
	/** Metric agent cache */
	protected Cache<String, Agent> agentCache;
	/** Metric cache */
	protected Cache<String, Metric> metricCache;
	
	/** The cache metric locator callback used to locate a metric when it is requested from cache */
	protected Callable<Metric> metricLocator = null;
	
	/** TraceType cache */
	protected final Map<Short, TraceType> traceTypeCache = new HashMap<>(); 
	
	/** The core count for this JVM */
	public static final int CORES = ManagementFactory.getOperatingSystemMXBean().getAvailableProcessors();
	
	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.metrics.IMetricProcessor#process(java.lang.CharSequence)
	 */
	@Override
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public void process(CharSequence metricInstance) {
		if(metricInstance==null) throw new IllegalArgumentException("The passed metric instance was null");
		try {
			InputMetric im = new InputMetric(metricInstance);
			log.info("Processing InputMetric [" + im.toString() + "]");
			metricCache.get(im.getMetricKey(), getMetricLocator(im));
		} catch (Exception ex) {
			String msg = "Failed to process metric instance [" + metricInstance + "]";
			log.error(msg, ex);
			throw new RuntimeException(msg, ex);
		} finally {
		}
	}
	
	/**
	 * Creates the cache callback metric locator which will cascade upwards to the agent and metric locators if they're not populated
	 * @param im The input metric
	 * @return the metric locator cache callback
	 */
	protected Callable<Metric> getMetricLocator(final InputMetric im) {
		return new Callable<Metric>() {
			Agent agent = null;
			Host host = null;
			@Override
			public Metric call() throws Exception {
				agent = agentCache.get(im.getAgentKey(), new Callable<Agent>() {
					public Agent call() throws Exception {
						host = hostCache.get(im.getHostKey(), new Callable<Host>(){
							public Host call() throws Exception {
								return metricLoader.loadHost(im.host, im.domain);
							}
						});
						return metricLoader.loadAgent(im.agent, (short)im.namespace.length(), host);
					}
				});
				return metricLoader.loadMetric(im.name, im.namespace, im.fragments, traceTypeCache.get(im.type), agent);
			}
		};
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
				.build();
		agentCache = CacheBuilder.newBuilder()
				.concurrencyLevel(CORES * 2)
				.recordStats()
				.softValues()
				.build();
		metricCache = CacheBuilder.newBuilder()
				.concurrencyLevel(CORES * 2)
				.recordStats()
				.softValues()
				.build();
		log.info("MetricProcessor Initialized");
	}
	

}
