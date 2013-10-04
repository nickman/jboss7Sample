/**
 * services
 */
package org.helios.jboss7.spring.context;

import javax.management.ObjectName;

import org.helios.jboss7.util.JMXHelper;
import org.springframework.context.ApplicationContext;

/**
 * <p>Title: ApplicationContextServiceMBean</p>
 * <p>Description: </p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.spring.context.ApplicationContextServiceMBean</code></p>
 */
public interface ApplicationContextServiceMBean extends ApplicationContext {
	public ApplicationContext getInstance();
	
	public static final ObjectName OBJECT_NAME = JMXHelper.objectName(new StringBuilder(ApplicationContextServiceMBean.class.getPackage().getName()).append(":service=").append(ApplicationContextService.class.getSimpleName()));
}	
