/**
 * services
 */
package org.helios.jboss7.spring;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.ejb.Remote;
import javax.ejb.Singleton;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanDefinitionStoreException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationListener;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;


/**
 * <p>Title: SpringRootContext</p>
 * <p>Description: </p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.spring.SpringRootContext</code></p>
 */
@Singleton

@Remote(ApplicationContext.class)
public class SpringRootContext implements ApplicationContext, ApplicationEventPublisher {
	/** The delegate application context */
	protected final GenericApplicationContext appCtx = SpringAppCtxManager.getInstance().getRootContext();

	/**
	 * @param classLoader
	 * @see org.springframework.core.io.DefaultResourceLoader#setClassLoader(java.lang.ClassLoader)
	 */
	public void setClassLoader(ClassLoader classLoader) {
		appCtx.setClassLoader(classLoader);
	}

	/**
	 * @return
	 * @see org.springframework.core.io.DefaultResourceLoader#getClassLoader()
	 */
	public ClassLoader getClassLoader() {
		return appCtx.getClassLoader();
	}

	/**
	 * @param parent
	 * @see org.springframework.context.support.GenericApplicationContext#setParent(org.springframework.context.ApplicationContext)
	 */
	public void setParent(ApplicationContext parent) {
		appCtx.setParent(parent);
	}

	/**
	 * @param id
	 * @see org.springframework.context.support.GenericApplicationContext#setId(java.lang.String)
	 */
	public void setId(String id) {
		appCtx.setId(id);
	}

	/**
	 * @param allowBeanDefinitionOverriding
	 * @see org.springframework.context.support.GenericApplicationContext#setAllowBeanDefinitionOverriding(boolean)
	 */
	public void setAllowBeanDefinitionOverriding(
			boolean allowBeanDefinitionOverriding) {
		appCtx.setAllowBeanDefinitionOverriding(allowBeanDefinitionOverriding);
	}

	/**
	 * @param allowCircularReferences
	 * @see org.springframework.context.support.GenericApplicationContext#setAllowCircularReferences(boolean)
	 */
	public void setAllowCircularReferences(boolean allowCircularReferences) {
		appCtx.setAllowCircularReferences(allowCircularReferences);
	}

	/**
	 * @param resourceLoader
	 * @see org.springframework.context.support.GenericApplicationContext#setResourceLoader(org.springframework.core.io.ResourceLoader)
	 */
	public void setResourceLoader(ResourceLoader resourceLoader) {
		appCtx.setResourceLoader(resourceLoader);
	}

	/**
	 * @param location
	 * @return
	 * @see org.springframework.context.support.GenericApplicationContext#getResource(java.lang.String)
	 */
	public Resource getResource(String location) {
		return appCtx.getResource(location);
	}

	/**
	 * @param locationPattern
	 * @return
	 * @throws IOException
	 * @see org.springframework.context.support.GenericApplicationContext#getResources(java.lang.String)
	 */
	public Resource[] getResources(String locationPattern) throws IOException {
		return appCtx.getResources(locationPattern);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.GenericApplicationContext#getBeanFactory()
	 */
	public final ConfigurableListableBeanFactory getBeanFactory() {
		return appCtx.getBeanFactory();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.GenericApplicationContext#getDefaultListableBeanFactory()
	 */
	public final DefaultListableBeanFactory getDefaultListableBeanFactory() {
		return appCtx.getDefaultListableBeanFactory();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getId()
	 */
	public String getId() {
		return appCtx.getId();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getApplicationName()
	 */
	public String getApplicationName() {
		return appCtx.getApplicationName();
	}

	/**
	 * @param displayName
	 * @see org.springframework.context.support.AbstractApplicationContext#setDisplayName(java.lang.String)
	 */
	public void setDisplayName(String displayName) {
		appCtx.setDisplayName(displayName);
	}

	/**
	 * @param beanName
	 * @param beanDefinition
	 * @throws BeanDefinitionStoreException
	 * @see org.springframework.context.support.GenericApplicationContext#registerBeanDefinition(java.lang.String, org.springframework.beans.factory.config.BeanDefinition)
	 */
	public void registerBeanDefinition(String beanName,
			BeanDefinition beanDefinition) throws BeanDefinitionStoreException {
		appCtx.registerBeanDefinition(beanName, beanDefinition);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getDisplayName()
	 */
	public String getDisplayName() {
		return appCtx.getDisplayName();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getParent()
	 */
	public ApplicationContext getParent() {
		return appCtx.getParent();
	}

	/**
	 * @param beanName
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.context.support.GenericApplicationContext#removeBeanDefinition(java.lang.String)
	 */
	public void removeBeanDefinition(String beanName)
			throws NoSuchBeanDefinitionException {
		appCtx.removeBeanDefinition(beanName);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getEnvironment()
	 */
	public ConfigurableEnvironment getEnvironment() {
		return appCtx.getEnvironment();
	}

	/**
	 * @param beanName
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.context.support.GenericApplicationContext#getBeanDefinition(java.lang.String)
	 */
	public BeanDefinition getBeanDefinition(String beanName)
			throws NoSuchBeanDefinitionException {
		return appCtx.getBeanDefinition(beanName);
	}

	/**
	 * @param beanName
	 * @return
	 * @see org.springframework.context.support.GenericApplicationContext#isBeanNameInUse(java.lang.String)
	 */
	public boolean isBeanNameInUse(String beanName) {
		return appCtx.isBeanNameInUse(beanName);
	}

	/**
	 * @param environment
	 * @see org.springframework.context.support.AbstractApplicationContext#setEnvironment(org.springframework.core.env.ConfigurableEnvironment)
	 */
	public void setEnvironment(ConfigurableEnvironment environment) {
		appCtx.setEnvironment(environment);
	}

	/**
	 * @param beanName
	 * @param alias
	 * @see org.springframework.context.support.GenericApplicationContext#registerAlias(java.lang.String, java.lang.String)
	 */
	public void registerAlias(String beanName, String alias) {
		appCtx.registerAlias(beanName, alias);
	}

	/**
	 * @param alias
	 * @see org.springframework.context.support.GenericApplicationContext#removeAlias(java.lang.String)
	 */
	public void removeAlias(String alias) {
		appCtx.removeAlias(alias);
	}

	/**
	 * @param beanName
	 * @return
	 * @see org.springframework.context.support.GenericApplicationContext#isAlias(java.lang.String)
	 */
	public boolean isAlias(String beanName) {
		return appCtx.isAlias(beanName);
	}

	/**
	 * @return
	 * @throws IllegalStateException
	 * @see org.springframework.context.support.AbstractApplicationContext#getAutowireCapableBeanFactory()
	 */
	public AutowireCapableBeanFactory getAutowireCapableBeanFactory()
			throws IllegalStateException {
		return appCtx.getAutowireCapableBeanFactory();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getStartupDate()
	 */
	public long getStartupDate() {
		return appCtx.getStartupDate();
	}

	/**
	 * @param event
	 * @see org.springframework.context.support.AbstractApplicationContext#publishEvent(org.springframework.context.ApplicationEvent)
	 */
	public void publishEvent(ApplicationEvent event) {
		appCtx.publishEvent(event);
	}

	/**
	 * @param beanFactoryPostProcessor
	 * @see org.springframework.context.support.AbstractApplicationContext#addBeanFactoryPostProcessor(org.springframework.beans.factory.config.BeanFactoryPostProcessor)
	 */
	public void addBeanFactoryPostProcessor(
			BeanFactoryPostProcessor beanFactoryPostProcessor) {
		appCtx.addBeanFactoryPostProcessor(beanFactoryPostProcessor);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeanFactoryPostProcessors()
	 */
	public List<BeanFactoryPostProcessor> getBeanFactoryPostProcessors() {
		return appCtx.getBeanFactoryPostProcessors();
	}

	/**
	 * @param listener
	 * @see org.springframework.context.support.AbstractApplicationContext#addApplicationListener(org.springframework.context.ApplicationListener)
	 */
	public void addApplicationListener(ApplicationListener<?> listener) {
		appCtx.addApplicationListener(listener);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getApplicationListeners()
	 */
	public Collection<ApplicationListener<?>> getApplicationListeners() {
		return appCtx.getApplicationListeners();
	}

	/**
	 * @throws BeansException
	 * @throws IllegalStateException
	 * @see org.springframework.context.support.AbstractApplicationContext#refresh()
	 */
	public void refresh() throws BeansException, IllegalStateException {
		appCtx.refresh();
	}

	/**
	 * 
	 * @see org.springframework.context.support.AbstractApplicationContext#registerShutdownHook()
	 */
	public void registerShutdownHook() {
		appCtx.registerShutdownHook();
	}

	/**
	 * 
	 * @see org.springframework.context.support.AbstractApplicationContext#destroy()
	 */
	public void destroy() {
		appCtx.destroy();
	}

	/**
	 * 
	 * @see org.springframework.context.support.AbstractApplicationContext#close()
	 */
	public void close() {
		appCtx.close();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#isActive()
	 */
	public boolean isActive() {
		return appCtx.isActive();
	}

	/**
	 * @param name
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBean(java.lang.String)
	 */
	public Object getBean(String name) throws BeansException {
		return appCtx.getBean(name);
	}

	/**
	 * @param name
	 * @param requiredType
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBean(java.lang.String, java.lang.Class)
	 */
	public <T> T getBean(String name, Class<T> requiredType)
			throws BeansException {
		return appCtx.getBean(name, requiredType);
	}

	/**
	 * @param requiredType
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBean(java.lang.Class)
	 */
	public <T> T getBean(Class<T> requiredType) throws BeansException {
		return appCtx.getBean(requiredType);
	}

	/**
	 * @param name
	 * @param args
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBean(java.lang.String, java.lang.Object[])
	 */
	public Object getBean(String name, Object... args) throws BeansException {
		return appCtx.getBean(name, args);
	}

	/**
	 * @param name
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#containsBean(java.lang.String)
	 */
	public boolean containsBean(String name) {
		return appCtx.containsBean(name);
	}

	/**
	 * @param name
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.context.support.AbstractApplicationContext#isSingleton(java.lang.String)
	 */
	public boolean isSingleton(String name)
			throws NoSuchBeanDefinitionException {
		return appCtx.isSingleton(name);
	}

	/**
	 * @param name
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.context.support.AbstractApplicationContext#isPrototype(java.lang.String)
	 */
	public boolean isPrototype(String name)
			throws NoSuchBeanDefinitionException {
		return appCtx.isPrototype(name);
	}

	/**
	 * @param name
	 * @param targetType
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.context.support.AbstractApplicationContext#isTypeMatch(java.lang.String, java.lang.Class)
	 */
	public boolean isTypeMatch(String name, Class<?> targetType)
			throws NoSuchBeanDefinitionException {
		return appCtx.isTypeMatch(name, targetType);
	}

	/**
	 * @param name
	 * @return
	 * @throws NoSuchBeanDefinitionException
	 * @see org.springframework.context.support.AbstractApplicationContext#getType(java.lang.String)
	 */
	public Class<?> getType(String name) throws NoSuchBeanDefinitionException {
		return appCtx.getType(name);
	}

	/**
	 * @param name
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getAliases(java.lang.String)
	 */
	public String[] getAliases(String name) {
		return appCtx.getAliases(name);
	}

	/**
	 * @param beanName
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#containsBeanDefinition(java.lang.String)
	 */
	public boolean containsBeanDefinition(String beanName) {
		return appCtx.containsBeanDefinition(beanName);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeanDefinitionCount()
	 */
	public int getBeanDefinitionCount() {
		return appCtx.getBeanDefinitionCount();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeanDefinitionNames()
	 */
	public String[] getBeanDefinitionNames() {
		return appCtx.getBeanDefinitionNames();
	}

	/**
	 * @param type
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeanNamesForType(java.lang.Class)
	 */
	public String[] getBeanNamesForType(Class<?> type) {
		return appCtx.getBeanNamesForType(type);
	}

	/**
	 * @param type
	 * @param includeNonSingletons
	 * @param allowEagerInit
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeanNamesForType(java.lang.Class, boolean, boolean)
	 */
	public String[] getBeanNamesForType(Class<?> type,
			boolean includeNonSingletons, boolean allowEagerInit) {
		return appCtx.getBeanNamesForType(type, includeNonSingletons,
				allowEagerInit);
	}

	/**
	 * @param type
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeansOfType(java.lang.Class)
	 */
	public <T> Map<String, T> getBeansOfType(Class<T> type)
			throws BeansException {
		return appCtx.getBeansOfType(type);
	}

	/**
	 * @param type
	 * @param includeNonSingletons
	 * @param allowEagerInit
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeansOfType(java.lang.Class, boolean, boolean)
	 */
	public <T> Map<String, T> getBeansOfType(Class<T> type,
			boolean includeNonSingletons, boolean allowEagerInit)
			throws BeansException {
		return appCtx
				.getBeansOfType(type, includeNonSingletons, allowEagerInit);
	}

	/**
	 * @param annotationType
	 * @return
	 * @throws BeansException
	 * @see org.springframework.context.support.AbstractApplicationContext#getBeansWithAnnotation(java.lang.Class)
	 */
	public Map<String, Object> getBeansWithAnnotation(
			Class<? extends Annotation> annotationType) throws BeansException {
		return appCtx.getBeansWithAnnotation(annotationType);
	}

	/**
	 * @param beanName
	 * @param annotationType
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#findAnnotationOnBean(java.lang.String, java.lang.Class)
	 */
	public <A extends Annotation> A findAnnotationOnBean(String beanName,
			Class<A> annotationType) {
		return appCtx.findAnnotationOnBean(beanName, annotationType);
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#getParentBeanFactory()
	 */
	public BeanFactory getParentBeanFactory() {
		return appCtx.getParentBeanFactory();
	}

	/**
	 * @param name
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#containsLocalBean(java.lang.String)
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
	 * @see org.springframework.context.support.AbstractApplicationContext#getMessage(java.lang.String, java.lang.Object[], java.lang.String, java.util.Locale)
	 */
	public String getMessage(String code, Object[] args, String defaultMessage,
			Locale locale) {
		return appCtx.getMessage(code, args, defaultMessage, locale);
	}

	/**
	 * @param code
	 * @param args
	 * @param locale
	 * @return
	 * @throws NoSuchMessageException
	 * @see org.springframework.context.support.AbstractApplicationContext#getMessage(java.lang.String, java.lang.Object[], java.util.Locale)
	 */
	public String getMessage(String code, Object[] args, Locale locale)
			throws NoSuchMessageException {
		return appCtx.getMessage(code, args, locale);
	}

	/**
	 * @param resolvable
	 * @param locale
	 * @return
	 * @throws NoSuchMessageException
	 * @see org.springframework.context.support.AbstractApplicationContext#getMessage(org.springframework.context.MessageSourceResolvable, java.util.Locale)
	 */
	public String getMessage(MessageSourceResolvable resolvable, Locale locale)
			throws NoSuchMessageException {
		return appCtx.getMessage(resolvable, locale);
	}

	/**
	 * 
	 * @see org.springframework.context.support.AbstractApplicationContext#start()
	 */
	public void start() {
		appCtx.start();
	}

	/**
	 * 
	 * @see org.springframework.context.support.AbstractApplicationContext#stop()
	 */
	public void stop() {
		appCtx.stop();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#isRunning()
	 */
	public boolean isRunning() {
		return appCtx.isRunning();
	}

	/**
	 * @return
	 * @see org.springframework.context.support.AbstractApplicationContext#toString()
	 */
	public String toString() {
		return appCtx.toString();
	}

}
