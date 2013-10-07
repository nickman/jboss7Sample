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

import java.io.Serializable;

import org.apache.log4j.Logger;
import org.helios.jboss7.hibernate.domain.Agent;
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
	
	/** The query name to find an agent given the agent name and host id */
	public static final String AGENT_RESOLVER = "agentForHost";
	
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
		query.setString(0, name);
		query.setInteger(1, hostId);
		return (Agent)query.uniqueResult();
	}

	/**
	 * Loads an object from hibernate
	 * @param key The key of the object
	 * @param type The type of the object
	 * @return the loaded object or null if not found
	 */
	@Transactional(readOnly=true, rollbackFor=Throwable.class)
	public <T> T load(Serializable key, Class<T> type) {
		if(key==null) throw new IllegalArgumentException("The passed key was null");
		if(type==null) throw new IllegalArgumentException("The passed type was null");
		if(log.isDebugEnabled()) log.debug("Loading instance of [" + type.getSimpleName() + "] with key [" + key + "]");
		try {
			return (T)sessionFactory.getCurrentSession().get(type, key);
		} catch (Exception ex) {
			String msg = "instance of [" + type.getSimpleName() + "] with key [" + key + "]";
			log.error(msg, ex);
			throw new RuntimeException(msg, ex);
		}
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
