/**
 * 
 */
package org.helios.jboss7.spring.context;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.util.Locale;
import java.util.Map;

import org.apache.log4j.Logger;
import org.helios.jboss7.util.JMXHelper;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;

/**
 * @author nwhitehe
 *
 */
public class ApplicationContextService implements ApplicationContextServiceMBean, ApplicationListener<ContextClosedEvent> {
	/** The delegate app context */
	protected final ApplicationContext appCtx;
	protected final Logger log = Logger.getLogger(getClass());
	/**
	 * Creates a new ApplicationContextService
	 * @param appCtx The delegate app context
	 */
	public ApplicationContextService(ApplicationContext appCtx) {
		super();
		this.appCtx = appCtx;
		if(JMXHelper.getICEMBeanServer().isRegistered(OBJECT_NAME)) {
			try { JMXHelper.getICEMBeanServer().unregisterMBean(OBJECT_NAME); } catch (Exception ex) {}
		}
		try { 
			JMXHelper.getICEMBeanServer().registerMBean(this, OBJECT_NAME);
			log.info("\n\t=============================================\n\tPublished AppCtx Service [" +  OBJECT_NAME + "]\n\t=============================================\t");
		} catch (Exception ex) {}
	}
	
	/**
	 * {@inheritDoc}
	 * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
	 */
	@Override
	public void onApplicationEvent(ContextClosedEvent event) {
		if(event.getApplicationContext()==appCtx) {
			try { JMXHelper.getICEMBeanServer().unregisterMBean(OBJECT_NAME); } catch (Exception ex) {}
		}		
	}
	
	
	
	public ApplicationContext getInstance() {
		return appCtx;
	}

	/**
	 * @param event
	 * @see org.springframework.context.ApplicationEventPublisher#publishEvent(org.springframework.context.ApplicationEvent)
	 */
	public void publishEvent(ApplicationEvent event) {
		appCtx.publishEvent(event);
	}

	/**
	 * @return
	 * @see org.springframework.beans.factory.HierarchicalBeanFactory#getParentBeanFactory()
	 */
	public BeanFactory getParentBeanFactory() {
		return appCtx.getParentBeanFactory();
	}

	/**
	 * @param name
	 * @return
	 * @see org.springframework.beans.factory.HierarchicalBeanFactory#containsLocalBean(java.lang.String)
	 */
	public boolean containsLocalBean(String name) {
		return appCtx.containsLocalBean(name);
	}

	/**
	 * @param code
	 * @param args
	 * @param defaultMessage
	 * @param locale
	 * @return
	 * @see org.springframework.context.MessageSource#getMessage(java.lang.String, java.lang.Object[], java.lang.String, java.util.Locale)
	 */
	public String getMessage(String code, Object[] args, String defaultMessage,
			Locale locale) {
		return appCtx.getMessage(code, args, defaultMessage, locale);
	}

	/**
	 * @param location
	 * @return
	 * @see org.springframework.core.io.ResourceLoader#getResource(java.lang.String)
	 */
	public Resource getResource(String location) {
		return appCtx.getResource(location);
	}

	/**
	 * @return
	 * @see org.springframework.core.env.EnvironmentCapable#getEnvironment()
	 */
	public Environment getEnvironment() {
		return appCtx.getEnvironment();
	}

	/**
	 * @param code
	 * @param args
	 * @param locale
	 * @return
	 * @throws NoSuchMessageException
	 * @see org.springframework.context.MessageSource#getMessage(java.lang.String, java.lang.Object[], java.util.Locale)
	 */
	public String getMessage(String code, Object[] args, Locale locale)
			throws NoSuchMessageException {
		return appCtx.getMessage(code, args, locale);
	}

	/**
	 * @param beanName
	 * @return
	 * @see org.springframework.beans.factory.ListableBeanFactory#containsBeanDefinition(java.lang.String)
	 */
	public boolean containsBeanDefinition(String beanName) {
		return appCtx.containsBeanDefinition(beanName);
	}

	/**
	 * @return
	 * @see org.springframework.core.io.ResourceLoader#getClassLoader()
	 */
	public ClassLoader getClassLoader() {
		return appCtx.getClassLoader();
	}

	/**
	 * @return
	 * @see org.springframework.context.ApplicationContext#getId()
	 */
	public String getId() {
		return appCtx.getId();
	}

	/**
	 * @param locationPattern
	 * @return
	 * @throws IOException
	 * @see org.springframework.core.io.support.ResourcePatternResolver#getResources(java.lang.String)
	 */
	public Resource[] getResources(String locationPattern) throws IOException {
		return appCtx.getResources(locationPattern);
	}

	/**
	 * @return
	 * @see org.springframework.context.ApplicationContext#getApplicationName()
	 */
	public String getApplicationName() {
		return appCtx.getApplicationName();
	}

	/**
	 * @param resolvable
	 * @param locale
	 * @return
	 * @throws NoSuchMessageException
	 * @see org.springframework.context.MessageSource#getMessage(org.springframework.context.MessageSourceResolvable, java.util.Locale)
	 */
	public String getMessage(MessageSourceResolvable resolvable, Locale locale)
			throws NoSuchMessageException {
		return appCtx.getMessage(resolvable, locale);
	}

	/**
	 * @return
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeanDefinitionCount()
	 */
	public int getBeanDefinitionCount() {
		return appCtx.getBeanDefinitionCount();
	}

	/**
	 * @return
	 * @see org.springframework.context.ApplicationContext#getDisplayName()
	 */
	public String getDisplayName() {
		return appCtx.getDisplayName();
	}

	/**
	 * @return
	 * @see org.springframework.context.ApplicationContext#getStartupDate()
	 */
	public long getStartupDate() {
		return appCtx.getStartupDate();
	}

	/**
	 * @return
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeanDefinitionNames()
	 */
	public String[] getBeanDefinitionNames() {
		return appCtx.getBeanDefinitionNames();
	}

	/**
	 * @return
	 * @see org.springframework.context.ApplicationContext#getParent()
	 */
	public ApplicationContext getParent() {
		return appCtx.getParent();
	}

	/**
	 * @return
	 * @throws IllegalStateException
	 * @see org.springframework.context.ApplicationContext#getAutowireCapableBeanFactory()
	 */
	public AutowireCapableBeanFactory getAutowireCapableBeanFactory()
			throws IllegalStateException {
		return appCtx.getAutowireCapableBeanFactory();
	}

	/**
	 * @param type
	 * @return
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeanNamesForType(java.lang.Class)
	 */
	public String[] getBeanNamesForType(Class<?> type) {
		return appCtx.getBeanNamesForType(type);
	}

	/**
	 * @param type
	 * @param includeNonSingletons
	 * @param allowEagerInit
	 * @return
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeanNamesForType(java.lang.Class, boolean, boolean)
	 */
	public String[] getBeanNamesForType(Class<?> type,
			boolean includeNonSingletons, boolean allowEagerInit) {
		return appCtx.getBeanNamesForType(type, includeNonSingletons,
				allowEagerInit);
	}

	/**
	 * @param name
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.BeanFactory#getBean(java.lang.String)
	 */
	public Object getBean(String name) throws BeansException {
		return appCtx.getBean(name);
	}

	/**
	 * @param name
	 * @param requiredType
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.BeanFactory#getBean(java.lang.String, java.lang.Class)
	 */
	public <T> T getBean(String name, Class<T> requiredType)
			throws BeansException {
		return appCtx.getBean(name, requiredType);
	}

	/**
	 * @param type
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeansOfType(java.lang.Class)
	 */
	public <T> Map<String, T> getBeansOfType(Class<T> type)
			throws BeansException {
		return appCtx.getBeansOfType(type);
	}

	/**
	 * @param requiredType
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.BeanFactory#getBean(java.lang.Class)
	 */
	public <T> T getBean(Class<T> requiredType) throws BeansException {
		return appCtx.getBean(requiredType);
	}

	/**
	 * @param name
	 * @param args
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.BeanFactory#getBean(java.lang.String, java.lang.Object[])
	 */
	public Object getBean(String name, Object... args) throws BeansException {
		return appCtx.getBean(name, args);
	}

	/**
	 * @param type
	 * @param includeNonSingletons
	 * @param allowEagerInit
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeansOfType(java.lang.Class, boolean, boolean)
	 */
	public <T> Map<String, T> getBeansOfType(Class<T> type,
			boolean includeNonSingletons, boolean allowEagerInit)
			throws BeansException {
		return appCtx
				.getBeansOfType(type, includeNonSingletons, allowEagerInit);
	}

	/**
	 * @param name
	 * @return
	 * @see org.springframework.beans.factory.BeanFactory#containsBean(java.lang.String)
	 */
	public boolean containsBean(String name) {
		return appCtx.containsBean(name);
	}

	/**
	 * @param name
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.beans.factory.BeanFactory#isSingleton(java.lang.String)
	 */
	public boolean isSingleton(String name)
			throws NoSuchBeanDefinitionException {
		return appCtx.isSingleton(name);
	}

	/**
	 * @param name
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.beans.factory.BeanFactory#isPrototype(java.lang.String)
	 */
	public boolean isPrototype(String name)
			throws NoSuchBeanDefinitionException {
		return appCtx.isPrototype(name);
	}

	/**
	 * @param annotationType
	 * @return
	 * @throws BeansException
	 * @see org.springframework.beans.factory.ListableBeanFactory#getBeansWithAnnotation(java.lang.Class)
	 */
	public Map<String, Object> getBeansWithAnnotation(
			Class<? extends Annotation> annotationType) throws BeansException {
		return appCtx.getBeansWithAnnotation(annotationType);
	}

	/**
	 * @param beanName
	 * @param annotationType
	 * @return
	 * @see org.springframework.beans.factory.ListableBeanFactory#findAnnotationOnBean(java.lang.String, java.lang.Class)
	 */
	public <A extends Annotation> A findAnnotationOnBean(String beanName,
			Class<A> annotationType) {
		return appCtx.findAnnotationOnBean(beanName, annotationType);
	}

	/**
	 * @param name
	 * @param targetType
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.beans.factory.BeanFactory#isTypeMatch(java.lang.String, java.lang.Class)
	 */
	public boolean isTypeMatch(String name, Class<?> targetType)
			throws NoSuchBeanDefinitionException {
		return appCtx.isTypeMatch(name, targetType);
	}

	/**
	 * @param name
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.beans.factory.BeanFactory#getType(java.lang.String)
	 */
	public Class<?> getType(String name) throws NoSuchBeanDefinitionException {
		return appCtx.getType(name);
	}

	/**
	 * @param name
	 * @return
	 * @see org.springframework.beans.factory.BeanFactory#getAliases(java.lang.String)
	 */
	public String[] getAliases(String name) {
		return appCtx.getAliases(name);
	}

	
}
