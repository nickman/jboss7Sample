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
package org.helios.jboss7.spring;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.helios.jboss7.spring.context.ApplicationContextService;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.context.support.GenericWebApplicationContext;

/**
 * <p>Title: WebContextFactory</p>
 * <p>Description: A factory for creating {@link GenericWebApplicationContext} instances to link this bean's context to the web context.</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.spring.WebContextFactory</code></p>
 */

public class WebContextFactory implements ApplicationContextAware {
	/** The application context this bean is deployed in */
	protected ApplicationContext applicationContext = null;
	/** The application context registry */
	@Autowired(required=false)
	protected ApplicationContextService appCtxService = null;
	/** A map of already created web app contexts */
	protected final Map<String, GenericWebApplicationContext> webAppContexts = new ConcurrentHashMap<String, GenericWebApplicationContext>();
	/**
	 * {@inheritDoc}
	 * @see org.springframework.context.ApplicationContextAware#setApplicationContext(org.springframework.context.ApplicationContext)
	 */
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}
	
	public GenericWebApplicationContext getWebContext(ServletContext sc) {
		return null;
	}

}
