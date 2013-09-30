/**
 * services
 */
package org.helios.jboss7.jms.mdb;

import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.Resource;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.transaction.Transaction;
import javax.transaction.TransactionManager;

import org.apache.log4j.Logger;
import org.helios.jboss7.util.TransactionHelper;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <p>Title: SpringMDB</p>
 * <p>Description: Spring version of an MDB</p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.jms.mdb.SpringMDB</code></p>
 */
public class SpringMDB implements MessageListener {
	protected static final AtomicInteger serialFactory = new AtomicInteger();
	protected final int serial = serialFactory.incrementAndGet();
	protected final Logger log = Logger.getLogger(getClass().getName() + "#" + serial);
	
	@Autowired(required=true)
	protected TransactionManager txManager = null;
	
	public SpringMDB() {
		log.info("Created SpringMDB Instance #" + serial);
	}
	
	public void onMessage(Message message) {
		if(message instanceof TextMessage) {
			try {
				log.info("Received Message [" + ((TextMessage)message).getText() + "]" + "TX Status:" + getTxStatus());
				log.info(TransactionHelper.getTransactionResourcesDump());
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
