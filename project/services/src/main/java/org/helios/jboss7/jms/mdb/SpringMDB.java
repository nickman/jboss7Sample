/**
 * services
 */
package org.helios.jboss7.jms.mdb;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.concurrent.atomic.AtomicInteger;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.sql.DataSource;
import javax.transaction.Transaction;
import javax.transaction.TransactionManager;

import org.apache.log4j.Logger;
import org.helios.jboss7.util.TransactionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * <p>Title: SpringMDB</p>
 * <p>Description: Spring version of an MDB</p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.jms.mdb.SpringMDB</code></p>
 */
public class SpringMDB extends BaseMDB implements MessageListener, ApplicationContextAware {
	
	@Autowired(required=true)
	protected TransactionManager txManager = null;
	protected ApplicationContext applicationContext = null;
	@Autowired(required=true)
	@Qualifier("h2")
	protected DataSource dataSource = null;

	
	public void onMessage(Message message) {
		super.onMessage(message);
		if(message instanceof TextMessage) {
			Connection conn = null;
			PreparedStatement ps = null;
			try {
				log.info("Received Message [" + ((TextMessage)message).getText() + "]" + "TX Status:" + getTxStatus());
				log.info(TransactionHelper.getTransactionResourcesDump());
				conn = getConnection();
				ps = conn.prepareStatement("INSERT INTO LOG VALUES(?)");
				ps.setString(1, "Received Message [" + ((TextMessage)message).getText() + "]" + "TX Status:" + getTxStatus() + "--" + System.nanoTime());
				ps.executeUpdate();
				log.info(TransactionHelper.getTransactionResourcesDump());
			} catch (Exception e) {
				log.error("Failed to process message", e);
				
			} finally {
				try { ps.close(); } catch (Exception e) {}
				try { conn.close(); } catch (Exception e) {}
			}
		} else {
			log.info("Received Message [" + message + "]" + "\n\tTX:" + txManager);
		}
	}
	
	protected Connection getConnection() {
		try {
			return dataSource.getConnection();
		} catch (SQLException e) {
			log.error("Failed to get connection", e);
			throw new RuntimeException("Failed to get connection", e);
		}
	}
	
	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;		
	}

}
