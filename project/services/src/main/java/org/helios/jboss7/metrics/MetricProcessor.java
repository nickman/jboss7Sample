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
import java.util.Date;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.helios.jboss7.hibernate.domain.Agent;
import org.helios.jboss7.hibernate.domain.Host;
import org.helios.jboss7.hibernate.domain.Metric;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;

/**
 * <p>Title: MetricProcessor</p>
 * <p>Description: Input metric processing endpoint</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.metrics.MetricProcessor</code></p>
 */

public class MetricProcessor implements InitializingBean {
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
	
	/** The core count for this JVM */
	public static final int CORES = ManagementFactory.getOperatingSystemMXBean().getAvailableProcessors();
	
	/** The in-state metric */
	private static final ThreadLocal<InputMetric> currentMetric = new ThreadLocal<InputMetric>(); 
	
	/**
	 * {@inheritDoc}
	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		log.info("Configuring MetricProcessor Caches.....");
		hostCache = CacheBuilder.newBuilder()
				.concurrencyLevel(CORES * 2)
				.recordStats()
				.softValues()
				.build(new CacheLoader<String, Host>(){
					@Override
					public Host load(String key) throws Exception {
						Host host = metricLoader.load(key, Host.class);
						if(host==null) {
							Date now = new Date();
							String[] nameDomain = Host.splitHostName(key);							
							host = new Host(nameDomain[0], nameDomain[1], now, now, 1);
							host = metricLoader.save(host);
						}						
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
						Agent agent = metricLoader.load(key, Host.class);
						if(host==null) {
							Date now = new Date();
							String[] nameDomain = Host.splitHostName(key);							
							host = new Host(nameDomain[0], nameDomain[1], now, now, 1);
							host = metricLoader.save(host);
						}						
						return host;
					}					
				});
		
		log.info("MetricProcessor Initialized");
	}
	

}
