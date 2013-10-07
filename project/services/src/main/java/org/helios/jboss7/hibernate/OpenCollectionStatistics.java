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
package org.helios.jboss7.hibernate;

import org.hibernate.stat.CollectionStatistics;

/**
 * <p>Title: OpenCollectionStatistics</p>
 * <p>Description: Open type wrapper for a {@link CollectionStatistics} instance </p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.hibernate.OpenCollectionStatistics</code></p>
 */

public class OpenCollectionStatistics implements OpenCollectionStatisticsMBean  {
	/** the delegate stats */
	protected final CollectionStatistics stats;
	/** The stat name */
	protected final String name;

	/**
	 * Creates a new OpenCollectionStatistics
	 * @param stats the delegate stats
	 * @param name The stat name
	 */
	public OpenCollectionStatistics(CollectionStatistics stats, String name) {
		this.stats = stats;
		this.name = name;
	}

	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.hibernate.OpenCollectionStatisticsMBean#getLoadCount()
	 */
	@Override
	public long getLoadCount() {
		return stats.getLoadCount();
	}

	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.hibernate.OpenCollectionStatisticsMBean#getFetchCount()
	 */
	@Override
	public long getFetchCount() {
		return stats.getFetchCount();
	}

	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.hibernate.OpenCollectionStatisticsMBean#getName()
	 */
	@Override
	public String getName() {
		return name;
	}

	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.hibernate.OpenCollectionStatisticsMBean#getRecreateCount()
	 */
	@Override
	public long getRecreateCount() {
		return stats.getRecreateCount();
	}

	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.hibernate.OpenCollectionStatisticsMBean#getRemoveCount()
	 */
	@Override
	public long getRemoveCount() {
		return stats.getRemoveCount();
	}

	/**
	 * {@inheritDoc}
	 * @see org.helios.jboss7.hibernate.OpenCollectionStatisticsMBean#getUpdateCount()
	 */
	@Override
	public long getUpdateCount() {
		return stats.getUpdateCount();
	}

}
