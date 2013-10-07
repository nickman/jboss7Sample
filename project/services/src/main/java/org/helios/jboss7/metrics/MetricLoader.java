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

import java.util.Collection;

import org.apache.log4j.Logger;
import org.helios.jboss7.hibernate.domain.Agent;
import org.helios.jboss7.hibernate.domain.Host;
import org.helios.jboss7.hibernate.domain.Metric;
import org.helios.jboss7.hibernate.domain.TraceType;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>Title: MetricLoader</p>
 * <p>Description: Handles metric object loading and creation</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.metrics.MetricLoader</code></p>
 */

public class MetricLoader {
	/** the hibernate session factory */
	@Autowired(required=true)
	protected SessionFactory sessionFactory = null;
	/** Instance logger */
	protected final Logger log = Logger.getLogger(getClass());

	/** The query name to find a host given the host name */
	public static final String HOST_RESOLVER = "hostByNameAndDomain";
	/** The query name to find an agent given the agent name and host id */
	public static final String AGENT_RESOLVER = "agentForHost";
	/** The query name to find a metric given the metric namespace and agent id */
	public static final String METRIC_RESOLVER = "metricByNamespaceAndAgent";
	
	/**
	 * Attempts to locate the agent with the passed name with the passed host id
	 * @param name The agent name
	 * @param hostId The host id
	 * @return the located agent or null if one was not found
	 */
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public Agent loadAgent(String name, int hostId) {
		if(name==null) throw new IllegalArgumentException("The passed agent name was null");
		if(hostId<1) throw new IllegalArgumentException("The passed hostId [" + hostId + "] was invalid");
		Query query = sessionFactory.getCurrentSession().getNamedQuery(AGENT_RESOLVER);
		query.setString("agentName", name);
		query.setInteger("hostId", hostId);
		return (Agent)query.uniqueResult();
	}
	
	/**
	 * Attempts to locate the metric with the passed namespace and the passed agent id
	 * @param name The metric namespace
	 * @param agentId The agent id
	 * @return the located metric or null if one was not found
	 */
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public Metric loadMetric(String name, int agentId) {
		if(name==null) throw new IllegalArgumentException("The passed agent name was null");
		if(agentId<1) throw new IllegalArgumentException("The passed agentId [" + agentId + "] was invalid");
		Query query = sessionFactory.getCurrentSession().getNamedQuery(METRIC_RESOLVER);
		query.setString("namespace", name);
		query.setInteger("agentId", agentId);
		return (Metric)query.uniqueResult();
	}
	
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public Collection<TraceType> getTraceTypes() {
		return (Collection<TraceType>)sessionFactory.getCurrentSession().createQuery("from TraceType").list();
	}
	
	/**
	 * Attempts to locate the host with the passed name and domain
	 * @param name The host name
	 * @param domain The domain
	 * @return the located host or null if one was not found
	 */
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public Host loadHost(String name, String domain) {
		if(name==null) throw new IllegalArgumentException("The passed host name was null");
		if(domain==null) throw new IllegalArgumentException("The passed domain name was null");
		Query query = sessionFactory.getCurrentSession().getNamedQuery(HOST_RESOLVER);
		query.setString("name", name);
		query.setString("domain", domain);
		return (Host)query.uniqueResult();
	}
	

//	/**
//	 * Loads an object from hibernate
//	 * @param key The key of the object
//	 * @param type The type of the object
//	 * @return the loaded object or null if not found
//	 */
//	@Transactional(readOnly=true, rollbackFor=Throwable.class)
//	public <T> T load(Serializable key, Class<T> type) {
//		if(key==null) throw new IllegalArgumentException("The passed key was null");
//		if(type==null) throw new IllegalArgumentException("The passed type was null");
//		if(log.isDebugEnabled()) log.debug("Loading instance of [" + type.getSimpleName() + "] with key [" + key + "]");
//		try {
//			return (T)sessionFactory.getCurrentSession().get(type, key);
//		} catch (Exception ex) {
//			String msg = "instance of [" + type.getSimpleName() + "] with key [" + key + "]";
//			log.error(msg, ex);
//			throw new RuntimeException(msg, ex);
//		}
//	}
//	
//	@Transactional(readOnly=true, rollbackFor=Throwable.class)
//	public <T> T load(Serializable key, String entityName) {
//		if(key==null) throw new IllegalArgumentException("The passed key was null");
//		if(entityName==null) throw new IllegalArgumentException("The passed entityName was null");
//		if(log.isDebugEnabled()) log.debug("Loading instance of [" + entityName + "] with key [" + key + "]");
//		try {
//			return (T)sessionFactory.getCurrentSession().get(entityName, key);
//		} catch (Exception ex) {
//			String msg = "instance of [" + entityName + "] with key [" + key + "]";
//			log.error(msg, ex);
//			throw new RuntimeException(msg, ex);
//		}
//	}
//	
	
	/**
	 * Saves or updates the passed object
	 * @param toSave The object to save
	 * @return The saved object
	 */
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public <T> T save(String entityName, T toSave) {
		if(toSave==null) throw new IllegalArgumentException("The passed object to save was null");
		sessionFactory.getCurrentSession().saveOrUpdate(entityName, toSave);
		return toSave;
	}
	
	/**
	 * Saves or updates the passed object
	 * @param toSave The object to save
	 * @return The saved object
	 */
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public <T> T save(T toSave) {
		if(toSave==null) throw new IllegalArgumentException("The passed object to save was null");
		sessionFactory.getCurrentSession().saveOrUpdate(toSave);
		return toSave;
	}
	

}
