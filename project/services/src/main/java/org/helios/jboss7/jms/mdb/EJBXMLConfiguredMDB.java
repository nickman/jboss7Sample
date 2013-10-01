/**
 * services
 */
package org.helios.jboss7.jms.mdb;

import java.util.concurrent.atomic.AtomicInteger;

import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.transaction.Transaction;

import org.apache.log4j.Logger;
import org.helios.jboss7.util.TransactionHelper;

/**
 * <p>Title: EJBXMLConfiguredMDB</p>
 * <p>Description: </p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.jms.mdb.EJBXMLConfiguredMDB</code></p>
 */
@MessageDriven(name = "EJBXMLConfiguredMDB")
@TransactionAttribute(TransactionAttributeType.REQUIRED)
public class EJBXMLConfiguredMDB implements MessageListener {
	protected static final AtomicInteger serialFactory = new AtomicInteger();
	protected final int serial = serialFactory.incrementAndGet();
	protected final Logger log = Logger.getLogger(getClass().getName() + "#" + serial);
	
	
	public EJBXMLConfiguredMDB() {
		log.info("Created EJBXMLConfiguredMDB Instance #");
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
			log.info("Received Message [" + message + "]" + "\n\tTX:" + TransactionHelper.getCurrentTransaction());
		}
	}
	
	public String getTxStatus() {
		try {
			Transaction tx = TransactionHelper.getCurrentTransaction();
			return String.format("[%s] - [%s]  Status:%s", tx.getClass().getName(), tx.toString(), tx.getStatus());
		} catch (Exception ex) {
			log.error("Failed to get TX Status", ex);
			return ex.getMessage();
		}
	}


}
