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
package org.helios.jboss7.hibernate.domain;

import java.io.Serializable;
import java.sql.Timestamp;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * <p>Title: MetricValue</p>
 * <p>Description: Base class representing a metric value</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.hibernate.domain.MetricValue</code></p>
 */

public class MetricValue implements Serializable, DomainObject {		
	private static final long serialVersionUID = -1873966563640830300L;
	/** The compound metricvalue id referencing the metric that this value is associated to */
	@SerializedName("metricValueId")
	protected MetricValueId metricValueId = null;
	private Metric metric;
	
	/** The circular ID for this value instance */
	@SerializedName("valueId")
	@Expose(serialize=false)
	protected int valueId = -1;
	/** The metric value timestamp */
	@SerializedName("timestamp")
	protected Timestamp valueTimestamp = null;
	/**
	 * Sets 
	 * @param metricValueId the metricValueId to set
	 */
	public void setMetricValueId(MetricValueId metricValueId) {
		this.metricValueId = metricValueId;
	}

	/**
	 * Sets 
	 * @param valueTimestamp the valueTimestamp to set
	 */
	public void setValueTimestamp(Timestamp valueTimestamp) {
		this.valueTimestamp = valueTimestamp;
	}

	/**
	 * Sets 
	 * @param value the value to set
	 */
	public void setValue(long value) {
		this.value = value;
	}

	/** The metric value */
	@SerializedName("value")
	protected long value = -1;
	
	public Metric getMetric() {
		return this.metric;
	}

	public void setMetric(Metric metric) {
		this.metric = metric;
	}
	
	/**
	 * Returns 
	 * @return the metricValueId
	 */
	public MetricValueId getMetricValueId() {
		return metricValueId;
	}
	
	public MetricValueId getId() {
		return metricValueId;
	}	
	
	public void setId(MetricValueId metricValueId) {
		this.metricValueId = metricValueId;
	}

	/**
	 * Returns 
	 * @return the valueId
	 */
	public int getValueId() {
		return valueId;
	}

	/**
	 * Returns 
	 * @return the valueTimestamp
	 */
	public Timestamp getValueTimestamp() {
		return valueTimestamp;
	}

	/**
	 * Returns 
	 * @return the value
	 */
	public long getValue() {
		return value;
	}

	/**
	 * Creates a new MetricValue
	 * @param metric The metric that this value is associated to
	 * @param valueId The circular ID for this value instance
	 * @param valueTimestamp The metric value timestamp
	 * @param value The metric value 
	 */
	public MetricValue(Metric metric, int valueId, Timestamp valueTimestamp, long value) {
		this.metricValueId = new MetricValueId(metric.getMetricId(), valueId);
		this.metric = metric;
		this.valueId = valueId;
		this.valueTimestamp = valueTimestamp;
		this.value = value;
	}
	
	/**
	 * Creates a new empty MetricValue
	 */
	public MetricValue() {
		
	}
	
	
}
