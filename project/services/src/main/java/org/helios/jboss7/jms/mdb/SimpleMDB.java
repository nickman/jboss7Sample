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
		@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
		@ActivationConfigProperty(propertyName = "destination", propertyValue = "REQUEST.QUEUE"),
		@ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge") })
@TransactionAttribute(TransactionAttributeType.REQUIRED)
@org.jboss.ejb3.annotation.ResourceAdapter("sample-ear.ear#amq-config")  
public class SimpleMDB implements MessageListener {
	protected static final AtomicInteger serialFactory = new AtomicInteger();
	protected final int serial = serialFactory.incrementAndGet();
	protected final Logger log = Logger.getLogger(getClass().getName() + "#" + serial);
	
	@Resource(lookup="java:jboss/TransactionManager")
	protected TransactionManager txManager = null;
	
	public SimpleMDB() {
		log.info("Created SimpleMDB Instance #");
	}
	
	public void onMessage(Message message) {
		if(message instanceof TextMessage) {
			try {
				log.info("Received Message [" + ((TextMessage)message).getText() + "]" + "TX Status:" + getTxStatus());
			} catch (JMSException e) {
				log.error("Failed to process message", e);
				e.printStackTrace();
			}
		} else {
			log.info("Received Message [" + message + "]" + "\n\tTX:" + txManager);
		}
	}
	
	public String getTxStatus() {
		try {
			Transaction tx = txManager.getTransaction();
			return String.format("[%s] - [%s]  Status:%s", tx.getClass().getName(), tx.toString(), tx.getStatus());
		} catch (Exception ex) {
			log.error("Failed to get TX Status", ex);
			return ex.getMessage();
		}
	}
}
