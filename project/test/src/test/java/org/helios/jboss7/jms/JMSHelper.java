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
package org.helios.jboss7.jms;

import javax.jms.ConnectionFactory;
import javax.naming.Context;
import javax.naming.InitialContext;

/**
 * <p>Title: JMSHelper</p>
 * <p>Description: Static JMS helper methods.</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.jms.JMSHelper</code></p>
 */

public class JMSHelper {
	/**
	 * Acquires a JMS connection factory from JNDI
	 * @param jndiName The JNDI name the factory is bound to 
	 * @return A JMS connection factory
	 */
	public static ConnectionFactory getConnectionFactory(String jndiName) {
		Context ctx = null;
		try {
			ctx = new InitialContext();
			return (ConnectionFactory)ctx.lookup(jndiName);
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		} finally {
			if(ctx!=null) try { ctx.close();} catch (Exception ex) {}
		}
	}
	
	
}
