/**
 * 
 */
package org.helios.jboss7.spring;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.support.AbstractApplicationContext;

/**
 * <p>Title: SpringAppCtxManager</p>
 * <p>Description: A Spring application context reference manager</p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.spring.SpringAppCtxManager</code></p>
 */
public class SpringAppCtxManager implements ApplicationContextAware, ApplicationListener<ApplicationContextEvent> {
	protected static final Logger LOG = Logger.getLogger(SpringAppCtxManager.class);
	/** The singleton instance */
	protected static volatile SpringAppCtxManager instance = null;
	/** The singleton instance ctor lock */
	protected static final Object lock = new Object();
	
	/** The root context name */
	public static final String ROOT_NAME = "RootAppCtx";
	/** A map of registered application contexts */
	protected final ConcurrentHashMap<String, ApplicationContext> contexts = new ConcurrentHashMap<String, ApplicationContext>();
	
	/**
	 * Acquires the singleton instance
	 * @return the singleton instance
	 */
	public static SpringAppCtxManager getInstance() {
		if(instance==null) {
			synchronized(lock) {
				if(instance==null) {
					instance = new SpringAppCtxManager(); 
				}
			}
		}
		return instance;
	}
	
	protected SpringAppCtxManager() {}
	
	
	/**
	 * Returns the named application context or null if the name is not resolved
	 * @param name The name of the application context
	 * @param type The application context type to cast to
	 * @return the named application context or null if the name is not resolved
	 */
	public <T extends ApplicationContext> T getApplicationContext(String name, Class<T> type) {
		if(name==null || name.trim().isEmpty()) throw new IllegalArgumentException("The passed name was null or empty");
		ApplicationContext ctx = contexts.get(name);
		if(ctx==null) return null;
		return type.cast(ctx);
	}
	
	/**
	 * Returns the named application context or null if the name is not resolved
	 * @param name The name of the application context
	 * @return the named application context or null if the name is not resolved
	 */
	public ApplicationContext getApplicationContext(String name) {
		return getApplicationContext(name, ApplicationContext.class);
	}
	
	/**
	 * Registers an application context, automatically replacing the bean already registered with the passed name if one exists
	 * @param name The designated name
	 * @param appCtx The application context to register
	 * @return the registry replaced applcation context or null if the named app ctx was not already registered
	 */
	public ApplicationContext register(String name, ApplicationContext appCtx) {
		return register(name, appCtx, true);
	}
	
	
	/**
	 * Registers an application context
	 * @param name The designated name
	 * @param appCtx The application context to register
	 * @param replace If true, an existing app ctx will be replaced, otherwise, an exception is thrown
	 * @return the registry replaced applcation context or null if the named app ctx was not already registered
	 */
	public ApplicationContext register(String name, ApplicationContext appCtx, boolean replace) {
		if(name==null || name.trim().isEmpty()) throw new IllegalArgumentException("The passed name was null or empty");
		if(appCtx==null) throw new IllegalArgumentException("The passed ApplicationContext was null");
		boolean newAppCtx = false;
		ApplicationContext replaced = null;
		if(!contexts.containsKey(name)) {
			synchronized(contexts) {
				if(!contexts.containsKey(name)) {
					contexts.put(name, appCtx);
					newAppCtx = true;
				}
			}
		}
		if(!newAppCtx && !replace) {
			throw new RuntimeException("The application context named [" + name + "] has already been registered");
		} else {
			if(!newAppCtx) {
				replaced = contexts.put(name, appCtx);
			}
		}
		if(appCtx instanceof AbstractApplicationContext) {
			((AbstractApplicationContext)appCtx).setDisplayName(name);
			((AbstractApplicationContext)appCtx).addApplicationListener(this);
		}
		return replaced;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		if(applicationContext!=null) {
			if(contexts.putIfAbsent(ROOT_NAME, applicationContext)==null) {
				register(ROOT_NAME, applicationContext);
			} 
		}		
	}

	/**
	 * <p>If the event is a {@link ContextClosedEvent}, the related app ctx will be removed from the registry if it can be located by {@link ApplicationContext#getDisplayName()}.
	 * Otherwise, if the event is a {@link ContextRefreshedEvent}, the related app ctx will be registered using the {@link ApplicationContext#getDisplayName()} as the name key.</p>
	 * {@inheritDoc}
	 * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
	 */
	@Override
	public void onApplicationEvent(ApplicationContextEvent event) {
		LOG.info("\n\t===========================================" + 
				"\n\tAppCtxEvent: [" + event.getClass().getName() + "]" +
				"\n\tTime: [" + new Date(event.getTimestamp()) + "]" + 
				"\n\tAppCtx: [" + event.getApplicationContext().getDisplayName() + "]" + 
				"\n\tType: [" + event.getApplicationContext().getClass().getName() + "]" +
			"\n\t===========================================\n"								
		);
		if(event instanceof ContextClosedEvent) {
			contexts.remove(event.getApplicationContext().getDisplayName());
		} else if(event instanceof ContextRefreshedEvent) {
			register(event.getApplicationContext().getDisplayName(), event.getApplicationContext());
		}		
	}
}
