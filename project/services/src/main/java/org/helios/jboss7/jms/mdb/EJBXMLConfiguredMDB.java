/**
 * services
 */
package org.helios.jboss7.jms.mdb;

import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.transaction.Transaction;

import org.helios.jboss7.util.TransactionHelper;

/**
 * <p>Title: EJBXMLConfiguredMDB</p>
 * <p>Description: </p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.jms.mdb.EJBXMLConfiguredMDB</code></p>
 */
@MessageDriven(name = "EJBXMLConfiguredMDB")
@TransactionAttribute(TransactionAttributeType.REQUIRED)
public class EJBXMLConfiguredMDB extends BaseMDB implements MessageListener  {
}
