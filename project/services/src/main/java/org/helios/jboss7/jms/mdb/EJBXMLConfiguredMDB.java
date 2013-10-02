/**
 * services
 */
package org.helios.jboss7.jms.mdb;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.jms.MessageListener;

import org.jboss.ejb3.annotation.ResourceAdapter;
/**
 * <p>Title: EJBXMLConfiguredMDB</p>
 * <p>Description: </p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.jms.mdb.EJBXMLConfiguredMDB</code></p>
 */

//@MessageDriven( name="EJBXMLConfiguredMDB", 
//activationConfig =
//{
//    @ActivationConfigProperty(propertyName = "destinationType",propertyValue = "javax.jms.Topic"),
//    @ActivationConfigProperty(propertyName = "useJNDI", propertyValue = "true"),
//    @ActivationConfigProperty(propertyName = "hostName", propertyValue = "localhost"),
//    @ActivationConfigProperty(propertyName = "port", propertyValue = "1415"),
//    @ActivationConfigProperty(propertyName = "channel", propertyValue = "JBOSS.SVRCONN"),
//    @ActivationConfigProperty(propertyName = "queueManager", propertyValue = "NJW_QM"),
//    @ActivationConfigProperty(propertyName = "destination", propertyValue = "java:jboss/jms/dest/WMQClearingTopic"),
//    @ActivationConfigProperty(propertyName = "transportType", propertyValue = "CLIENT")
//})
//@ResourceAdapter("sample-ear.ear#wmq-config.rar")
@TransactionAttribute(TransactionAttributeType.SUPPORTS)

public class EJBXMLConfiguredMDB extends BaseMDB implements MessageListener  {
}
