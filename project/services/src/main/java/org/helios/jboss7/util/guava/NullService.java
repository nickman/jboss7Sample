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
package org.helios.jboss7.util.guava;

import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.common.util.concurrent.Service;

/**
 * <p>Title: NullService</p>
 * <p>Description: An empty service to prevent deployment issues with guava's ServiceManager</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.util.guava.NullService</code></p>
 */

public class NullService implements Service {

	/**
	 * Creates a new NullService
	 */
	public NullService() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#start()
	 */
	@Override
	public ListenableFuture<State> start() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#startAndWait()
	 */
	@Override
	public State startAndWait() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#startAsync()
	 */
	@Override
	public Service startAsync() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#isRunning()
	 */
	@Override
	public boolean isRunning() {
		// TODO Auto-generated method stub
		return false;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#state()
	 */
	@Override
	public State state() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#stop()
	 */
	@Override
	public ListenableFuture<State> stop() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#stopAndWait()
	 */
	@Override
	public State stopAndWait() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#stopAsync()
	 */
	@Override
	public Service stopAsync() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitRunning()
	 */
	@Override
	public void awaitRunning() {
		// TODO Auto-generated method stub

	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitRunning(long, java.util.concurrent.TimeUnit)
	 */
	@Override
	public void awaitRunning(long timeout, TimeUnit unit)
			throws TimeoutException {
		// TODO Auto-generated method stub

	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitTerminated()
	 */
	@Override
	public void awaitTerminated() {
		// TODO Auto-generated method stub

	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitTerminated(long, java.util.concurrent.TimeUnit)
	 */
	@Override
	public void awaitTerminated(long timeout, TimeUnit unit)
			throws TimeoutException {
		// TODO Auto-generated method stub

	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#failureCause()
	 */
	@Override
	public Throwable failureCause() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#addListener(com.google.common.util.concurrent.Service.Listener, java.util.concurrent.Executor)
	 */
	@Override
	public void addListener(Listener listener, Executor executor) {
		// TODO Auto-generated method stub

	}

}
