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

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import javax.enterprise.inject.Produces;

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
	protected State state = State.NEW;
	
	@Produces Set<Service> dummyServices() {
	    return Collections.unmodifiableSet(new HashSet<Service>());
	}

	/**
	 * Creates a new NullService
	 */
	public NullService() {

	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#start()
	 */
	@Override
	public ListenableFuture<State> start() {
		state = State.RUNNING;
		return new ListenableFuture<State>(){

			@Override
			public boolean cancel(boolean mayInterruptIfRunning) {
				return false;
			}

			@Override
			public boolean isCancelled() {
				return false;
			}

			@Override
			public boolean isDone() {
				return true;
			}

			@Override
			public State get() throws InterruptedException, ExecutionException {
				return state;
			}

			@Override
			public State get(long timeout, TimeUnit unit)
					throws InterruptedException, ExecutionException,
					TimeoutException {
				// TODO Auto-generated method stub
				return state;
			}

			@Override
			public void addListener(Runnable listener, Executor executor) {
				
			}
			
		};
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#startAndWait()
	 */
	@Override
	public State startAndWait() {
		return State.RUNNING;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#startAsync()
	 */
	@Override
	public Service startAsync() {
		return this;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#isRunning()
	 */
	@Override
	public boolean isRunning() {
		return state==State.RUNNING;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#state()
	 */
	@Override
	public State state() {
		return state;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#stop()
	 */
	@Override
	public ListenableFuture<State> stop() {
		state = State.TERMINATED;
		return new ListenableFuture<State>(){

			@Override
			public boolean cancel(boolean mayInterruptIfRunning) {
				return false;
			}

			@Override
			public boolean isCancelled() {
				return false;
			}

			@Override
			public boolean isDone() {
				return true;
			}

			@Override
			public State get() throws InterruptedException, ExecutionException {
				return state;
			}

			@Override
			public State get(long timeout, TimeUnit unit)
					throws InterruptedException, ExecutionException,
					TimeoutException {
				// TODO Auto-generated method stub
				return state;
			}

			@Override
			public void addListener(Runnable listener, Executor executor) {
				
			}
			
		};
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#stopAndWait()
	 */
	@Override
	public State stopAndWait() {
		return State.TERMINATED;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#stopAsync()
	 */
	@Override
	public Service stopAsync() {
		return this;
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitRunning()
	 */
	@Override
	public void awaitRunning() {


	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitRunning(long, java.util.concurrent.TimeUnit)
	 */
	@Override
	public void awaitRunning(long timeout, TimeUnit unit)
			throws TimeoutException {


	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitTerminated()
	 */
	@Override
	public void awaitTerminated() {


	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#awaitTerminated(long, java.util.concurrent.TimeUnit)
	 */
	@Override
	public void awaitTerminated(long timeout, TimeUnit unit)
			throws TimeoutException {

	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#failureCause()
	 */
	@Override
	public Throwable failureCause() {
		return new Throwable();
	}

	/**
	 * {@inheritDoc}
	 * @see com.google.common.util.concurrent.Service#addListener(com.google.common.util.concurrent.Service.Listener, java.util.concurrent.Executor)
	 */
	@Override
	public void addListener(Listener listener, Executor executor) {

	}

}
