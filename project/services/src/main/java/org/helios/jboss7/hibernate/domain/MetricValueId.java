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

/**
 * <p>Title: MetricValueId</p>
 * <p>Description: Composite PK class for {@link MetricValue}</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.hibernate.domain.MetricValueId</code></p>
 */

public class MetricValueId implements Serializable {
	/**  */
	private static final long serialVersionUID = 646411287937910540L;
	private long metricId;
	private int valueId;

	public MetricValueId() {
	}

	public MetricValueId(long metricId, int valueId) {
		this.metricId = metricId;
		this.valueId = valueId;
	}

	public long getMetricId() {
		return this.metricId;
	}

	public void setMetricId(long metricId) {
		this.metricId = metricId;
	}

	public int getValueId() {
		return this.valueId;
	}

	public void setValueId(int valueId) {
		this.valueId = valueId;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof MetricValueId))
			return false;
		MetricValueId castOther = (MetricValueId) other;

		return (this.getMetricId() == castOther.getMetricId())
				&& (this.getValueId() == castOther.getValueId());
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + (int) this.getMetricId();
		result = 37 * result + this.getValueId();
		return result;
	}

}
