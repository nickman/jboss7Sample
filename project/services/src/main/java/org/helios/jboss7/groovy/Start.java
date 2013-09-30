
package org.helios.jboss7.groovy;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>Title: Start</p>
 * <p>Description: Annotates a method in a groovy script that should be invoked when the class is loaded.</p> 
 * @author Whitehead 
 * <p><code>org.helios.jboss7.groovy.Start</code></p>
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Start {

}
