/**
 * 
 */
package org.helios.jboss7.jms.mdb;

import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.Resource;
import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.transaction.Transaction;
import javax.transaction.TransactionManager;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author nwhitehead
 *
 */
/**
 * <p>Title: SimpleMDB</p>
 * <p>Description: </p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.jms.mdb.SimpleMDB</code></p>
 */
@MessageDriven(name = "SimpleMDB", activationConfig = {
		@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Topic"),
		@ActivationConfigProperty(propertyName = "destination", propertyValue = "CLEARING.TOPIC"),
		@ActivationConfigProperty(propertyName = "clientId", propertyValue = "SimpleMDB-ClearingTopic"),
		@ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge") })
@TransactionAttribute(TransactionAttributeType.REQUIRED)
@org.jboss.ejb3.annotation.ResourceAdapter("sample-ear.ear#amq-config.rar")  
public class SimpleMDB extends BaseMDB implements MessageListener {
	
}
