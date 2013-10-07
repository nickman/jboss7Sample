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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <p>Title: InputMetric</p>
 * <p>Description: Lightweight input representation</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.metrics.InputMetric</code></p>
 */

public class InputMetric {
	/** The metric expression pattern */
	public static final Pattern METRIC_PATTERN = Pattern.compile("(.*)?:(.*)?:(/.*)+?:(\\d+)?:(\\d+)(?:\\.\\d+)?$");
	/** The namespace splitter */
	public static final Pattern NAMESPACE_SPLITTER = Pattern.compile("\\/");
	/** The metric expression format */
	public static final String FORMAT = "%s:%s:%s:%s:%s";
	/** The agent key expression format */
	public static final String AGENT_KEY = "%s:%s";
	/** The metric key expression format */
	public static final String METRIC_KEY = "%s:%s%s";
	
	/** The group index for the host */
	public static final int GROUP_HOST = 1;
	/** The group index for the agent */
	public static final int GROUP_AGENT = 2;
	/** The group index for the namespace */
	public static final int GROUP_NAMESPACE = 3;
	/** The group index for the type */
	public static final int GROUP_TYPE = 4;
	/** The group index for the value */
	public static final int GROUP_VALUE = 5;
	
	
	/** The host name */
	public final String host;
	/** The agent name */
	public final String agent;
	/** The full metric name space */
	public final String namespace;
	/** The rightmost metric namespace fragment */
	public final String name;
	/** The split metric name fragments */
	public final String[] fragments;
	/** The metric type code */
	public final short type;
	/** The metric value */
	public final long value;
	
	/** The host id (pk) */
	public int hostId = -1;
	/** The agent id (pk) */
	public int agentId = -1;
	/** The metric id (pk) */
	public long metricId = -1;
	
	/**
	 * Returns the agent cache key
	 * @return the agent cache key
	 */
	public String getAgentKey() {
		return String.format(AGENT_KEY, host, agent);
	}

	/**
	 * Returns the metric cache key
	 * @return the metric cache key
	 */
	public String getMetricKey() {
		return String.format(METRIC_KEY, host, agent, namespace);
	}

	/**
	 * Creates a new InputMetric
	 * @param fullName The fully qualified metric instance expression
	 */
	public InputMetric(CharSequence fullName) {
		if(fullName==null) throw new IllegalArgumentException("The passed name was null");
		Matcher matcher = METRIC_PATTERN.matcher(fullName.toString().trim());
		if(!matcher.matches()) throw new IllegalArgumentException("The passed name [" + fullName + "] was not a recognized metric pattern");
		host = matcher.group(GROUP_HOST);
		agent = matcher.group(GROUP_AGENT);
		namespace = matcher.group(GROUP_NAMESPACE);
		type = Short.parseShort(matcher.group(GROUP_TYPE));
		value = Long.parseLong(matcher.group(GROUP_VALUE));
		fragments = NAMESPACE_SPLITTER.split(namespace.substring(1));
		name = fragments[fragments.length-1];
	}
	
	/**
	 * {@inheritDoc}
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return String.format(FORMAT, host, agent, namespace, type, value);
	}

}
