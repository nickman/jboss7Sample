/**
 * 
 */
package org.helios.jboss7.jms.mdb;

import java.util.concurrent.atomic.AtomicInteger;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.jms.Message;
import javax.jms.MessageListener;

import org.apache.log4j.Logger;

/**
 * @author nwhitehead
 *
 */
@MessageDriven(name = "SimpleMDB", activationConfig = {
		@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
		@ActivationConfigProperty(propertyName = "destination", propertyValue = "java:jboss/jms/dest/requestQueue"),
		@ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge") })
@TransactionAttribute(TransactionAttributeType.REQUIRED)
@org.jboss.ejb3.annotation.ResourceAdapter("sample-ear.ear#amq-config")  
public class SimpleMDB implements MessageListener {
	protected static final AtomicInteger serialFactory = new AtomicInteger();
	protected final int serial = serialFactory.incrementAndGet();
	protected final Logger log = Logger.getLogger(getClass().getName() + "#" + serial);
	
	public SimpleMDB() {
		log.info("Created SimpleMDB Instance #" + serial);
	}
	
	public void onMessage(Message message) {
		log.info("Received Message [" + message + "]");
	}
	
}
