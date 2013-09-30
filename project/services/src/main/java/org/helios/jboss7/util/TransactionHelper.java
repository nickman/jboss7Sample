/**
 * services
 */
package org.helios.jboss7.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.concurrent.atomic.AtomicReference;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.transaction.Synchronization;
import javax.transaction.SystemException;
import javax.transaction.Transaction;
import javax.transaction.TransactionManager;
import javax.transaction.TransactionSynchronizationRegistry;
import javax.transaction.UserTransaction;
import javax.transaction.xa.XAResource;

import org.apache.log4j.Logger;

/**
 * <p>Title: TransactionHelper</p>
 * <p>Description: TransactionManager helper utility class</p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.util.TransactionHelper</code></p>
 */
public class TransactionHelper {
	public static final String TXClassName = "com.arjuna.ats.internal.jta.transaction.arjunacore.TransactionImple";
	public static final String TXManagerClassName = "com.arjuna.ats.jbossatx.jta.TransactionManagerDelegate";
	public static final String TXRegistryClassName = "com.arjuna.ats.internal.jta.transaction.arjunacore.TransactionSynchronizationRegistryImple";
	//public static final String TXManagerClassName = "com.arjuna.ats.internal.jta.transaction.arjunacore.TransactionManagerImple";
	public static final String ArjunaTXManagerName  = " com.arjuna.ats.jbossatx.jta.TransactionManagerDelegate";
	public static final String TXUserTransactionClassName = "com.arjuna.ats.jta.UserTransaction";
	public static final String  AtomicActionClassName = "com.arjuna.ats.arjuna.AtomicAction";
	private static final Logger LOG = Logger.getLogger(TransactionHelper.class);
	private static final String xAResourcesFieldName = "_resources";
	private static Field xAResourcesField = null;
	private static Method getUidMethod = null;
	private static Method getTimeoutMethod = null;
	private static Method getUserTransactionMethod = null;
	private static Method getTXTimeoutMethod = null;
	private static Method getAtomicActionMethod = null;

	
	
	/** Random to generate a unique key for registered synch runnables */
	private static Random random = new Random(System.currentTimeMillis());
	
	private static final ThreadLocal<TXStatus> txStat = new ThreadLocal<TXStatus>();
	
	
	/**
	 * Returns the TX completion status.
	 * Only in scope for the Synchrnonization callback.
	 * @return the TX completion status.
	 */
	public static TXStatus getCompletionTXStatus() {
		return txStat.get();
	}
	
	static {
		Class<?> clazz = null;
		Object tm = TransactionManagerLocator.locate();
		try {
			
			clazz = Class.forName(TXClassName, true, tm.getClass().getClassLoader());
			xAResourcesField = clazz.getDeclaredField(xAResourcesFieldName);
			xAResourcesField.setAccessible(true);
			getAtomicActionMethod = clazz.getDeclaredMethod("getAtomicAction");
			getAtomicActionMethod.setAccessible(true);
		} catch (Exception e) {
			LOG.fatal("Failed to acquire resource field from class [" + TXClassName + "]", e);
		}
		try {
			getUidMethod = clazz.getDeclaredMethod("get_uid");
			getUidMethod.setAccessible(true);
		} catch (Exception e) {
			LOG.fatal("Failed to acquire get_uid method from class [" + TXClassName + "]", e);
		}
		try {
			clazz = Class.forName(TXManagerClassName, true, tm.getClass().getClassLoader());
			getTimeoutMethod = clazz.getDeclaredMethod("getTransactionTimeout");
			getTimeoutMethod.setAccessible(true);
		} catch (Exception e) {
			LOG.fatal("Failed to acquire getTimeoutMethod method from class [" + TXManagerClassName + "]", e);
		}
		try {
			clazz = Class.forName(TXUserTransactionClassName, true, tm.getClass().getClassLoader());
			getUserTransactionMethod = clazz.getDeclaredMethod("userTransaction");
		} catch (Exception e) {
			LOG.fatal("Failed to acquire userTransaction method from class [" + TXUserTransactionClassName + "]", e);
		}
		try {
			clazz = Class.forName(AtomicActionClassName, true, tm.getClass().getClassLoader());
			getTXTimeoutMethod = clazz.getDeclaredMethod("getTimeout");
			getTXTimeoutMethod.setAccessible(true);
		} catch (Exception e) {
			LOG.fatal("Failed to acquire AtomicAction.getTimeout method from class [" + AtomicActionClassName + "]", e);
		}
		
		
	}
	
	/** An atomic reference to cache the TransactionManager */
	protected static final AtomicReference<TransactionManager> TX_MANAGER = new AtomicReference<TransactionManager>(null);
	/** An atomic reference to cache the TransactionSynch Registry*/
	protected static final AtomicReference<TransactionSynchronizationRegistry> TX_REGISTRY = new AtomicReference<TransactionSynchronizationRegistry>(null);
	/** An atomic reference to cache the UserTransaction */
	protected static final AtomicReference<UserTransaction> USER_TX = new AtomicReference<UserTransaction>(null);
	
	/**
	 * Returns the containers transaction manager
	 * @return the JTA transaction manager
	 */
	public static TransactionManager getTransactionManager() {
		TransactionManager tm = TX_MANAGER.get();
		if(tm==null) {
			synchronized(TX_MANAGER) {
				tm = TX_MANAGER.get();
				if(tm==null) {
					tm = TransactionManagerLocator.locate();
					TX_MANAGER.set(tm);
				}				
			}			
		}
		return tm;
	}
	
	
	public static TransactionSynchronizationRegistry getTXRegistry() {
		TransactionSynchronizationRegistry txr = TX_REGISTRY.get();
		if(txr==null) {
			synchronized(TX_REGISTRY) {
				txr = TX_REGISTRY.get();
				if(txr==null) {
					txr = TransactionSynchronizationRegistryLocator.locate();
					TX_REGISTRY.set(txr);
				}				
			}			
		}
		return txr;

	}
	
	public static UserTransaction getUserTransaction() {
		UserTransaction txr = USER_TX.get();
		if(txr==null) {
			synchronized(USER_TX) {
				txr = USER_TX.get();
				if(txr==null) {
					txr = UserTransactionLocator.locate();
					USER_TX.set(txr);
				}				
			}			
		}
		return txr;

	}
	
	
	private static class TransactionSynchronizationRegistryLocator {
		public static TransactionSynchronizationRegistry locate() {
			Context ctx = null;
			try {
				ctx = new InitialContext();
				return (TransactionSynchronizationRegistry)ctx.lookup("java:jboss/TransactionSynchronizationRegistry");
			} catch (Exception e) {
				throw new RuntimeException("Failed to locate TransactionSynchronizationRegistry", e);
			} finally {
				try { ctx.close(); } catch (Exception x) {}
			}
		}
	}

	
	private static class TransactionManagerLocator {
		public static TransactionManager locate() {
			Context ctx = null;
			try {
				ctx = new InitialContext();
				return (TransactionManager)ctx.lookup("java:jboss/TransactionManager");
			} catch (Exception e) {
				throw new RuntimeException("Failed to locate TransactionSynchronizationRegistry", e);
			} finally {
				try { ctx.close(); } catch (Exception x) {}
			}
		}
	}
	
	private static class UserTransactionLocator {
		public static UserTransaction locate() {
			Context ctx = null;
			try {
				ctx = new InitialContext();
				return (UserTransaction)ctx.lookup("java:jboss/UserTransaction");
			} catch (Exception e) {
				throw new RuntimeException("Failed to locate UserTransaction", e);
			} finally {
				try { ctx.close(); } catch (Exception x) {}
			}
		}
	}
	
	
	/**
	 * Returns the timeout of the current transaction in seconds
	 * @return the current transaction timeout in seconds
	 */
	public static int getTransactionTimeout() {
		try {
			return (Integer)getTXTimeoutMethod.invoke(getAtomicActionMethod.invoke(getCurrentTransaction()));
		} catch (Exception e) {
			return 0;
		}
	}
	
	/**
	 * Returns the timeout of the passed transaction in seconds
	 * @param tx The transaction to get the timeout for.
	 * @return the passed transaction timeout in seconds
	 */
	public static int getTransactionTimeout(Transaction tx) {
		try {
			return (Integer)getTXTimeoutMethod.invoke(getAtomicActionMethod.invoke(tx));
		} catch (Exception e) {
			System.err.println("Failed to get Transaction Timeout");
			e.printStackTrace(System.err);
			return 0;
		}
	}
	

	
	
	/**
	 * Returns the transaction manager's TX timeout for the current thread.
	 * @return the TX timeout for the current thread in seconds
	 */
	public static int getTransactionManagerTimeout() {
		try {
			return (Integer)getTimeoutMethod.invoke(getTransactionManager());
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * Sets the transaction timeout for subsequent started transactions on the current thread.
	 * @param timeoutSeconds The transaction timeout in seconds
	 */
	public static void setTransactionTimeout(int timeoutSeconds) {
		try {
			getTransactionManager().setTransactionTimeout(timeoutSeconds);
		} catch (SystemException e) {
			throw new RuntimeException(new StringBuilder("Failed to set TXManager timeout to [").append(timeoutSeconds).append("] for Thread [").append(Thread.currentThread().getName()).append("/").append(Thread.currentThread().getId()).append("]").toString(), e);
		}
	}
	
	
	/**
	 * Returns the internal UID of the passed transaction
	 * @param tx The transaction
	 * @return the internal UID or a blank string not acquirable
	 */
	public static String getTransactionUID(Transaction tx) {
		try {
			return getUidMethod.invoke(tx).toString();
		} catch (Exception e) {
			return "<Unavailable>";
		}
	}
	
	/**
	 * Returns the internal UID of the current transaction
	 * @return the internal UID or a blank string not acquirable
	 */
	public static String getTransactionUID() {
		return getTransactionUID(getCurrentTransaction());
	}
	
	/**
	 * Returns the TXStatus of the passed transaction
	 * @param tx the transaction
	 * @return the TXStatus of the transaction or null if it could not be determined
	 */
	public static TXStatus getTransactionState(Transaction tx) {
		try {
			return TXStatus.statusOf(tx);
		} catch (Exception e) {
			return null;
		}
	}
	
	/**
	 * Returns the TXStatus of the current transaction
	 * @return the TXStatus of the transaction or null if it could not be determined
	 */
	public static TXStatus getTransactionState() {
		try {
			return TXStatus.statusOf(getCurrentTransaction());
		} catch (Exception e) {
			return null;
		}
	}

	
	
	/**
	 * Acquires the current transaction
	 * @return a JTA transaction or null if no transaction is associated with the current thread.
	 */
	public static Transaction getCurrentTransaction() {
		try {
			return getTransactionManager().getTransaction();			
		} catch (SystemException e) {
			throw new RuntimeException("System exception acquiring transaction", e);
		}
	}
	
	
	/**
	 * Returns a map of registered resources for the passed transaction
	 * The map is of the transaction TXInfo keyed by XA Resource
	 * @param tx the transaction to get the resources for 
	 * @return an unmodifiable map of the resources located for the passed transaction. If an exception occurs, the map will be empty.
	 */
	public static Map<XAResource,?> getTransactionResources(Transaction tx) {
		if(xAResourcesField==null || tx==null || !TXClassName.equals(tx.getClass().getName())) {
			return Collections.EMPTY_MAP;
		}
		try {
			return Collections.unmodifiableMap((Hashtable)xAResourcesField.get(tx));
		} catch (Throwable t) {
			LOG.error("Failed to acquire resources from Transaction [" + tx + "]", t);
			return  Collections.EMPTY_MAP;
		}
	}
	
	/**
	 * Returns a map of registered resources for the current transaction.
	 * The map is of the transaction TXInfo keyed by XA Resource
	 * @return an unmodifiable map of the resources located for the passed transaction. If an exception occurs, the map will be empty.
	 */
	public static Map<XAResource,?> getTransactionResources() {
		return getTransactionResources(getCurrentTransaction());
	}
	
	/**
	 * Generates a formatted string representing the registered resources in the passed transaction
	 * @param tx a JTA transaction
	 * @return a formatted string representing the registered resources in the passed transaction
	 */
	public static String getTransactionResourcesDump(Transaction tx) {
		if(tx==null) return "No Current Transaction";
		StringBuilder b = new StringBuilder("Transaction Registered Resource Dump \n\t[");
		b.append(tx.getClass().getName()).append(":").append(tx.toString()).append("]");
		for(Map.Entry<XAResource, ?> entry: getTransactionResources(tx).entrySet()) {
			b.append("\n\t").append(entry.getKey()).append(":").append(entry.getValue());
		}		
		b.append("\n====================================");
		return b.toString();
	}
	
	/**
	 * Executes the passed Runnable in a new transaction which is commited on successful completion or rolledback if the runnable execution throws an exception.
	 * If there is a transaction already in scope on call, it will be suspended and resumed on completion of this method.
	 * The TX timeout is 0 which is the TX Manager's default. 
	 * @param task A runnable task
	 */
	public static void executeInNewTX(Runnable task) {
		executeInNewTX(0, task);
	}
	
	/**
	 * Executes the passed Runnable in a new transaction which is commited on successful completion or rolledback if the runnable execution throws an exception.
	 * If there is a transaction already in scope on call, it will be suspended and resumed on completion of this method. 
	 * @param timeout The TX timeout in seconds.
	 * @param task A runnable task
	 */
	public static void executeInNewTX(int timeout, Runnable task) {
		if(task==null) {
			throw new RuntimeException("executeInNewTX was passed a null task");
		}
		Transaction currentTx = null;
		int currentTXTimeout = TransactionHelper.getTransactionManagerTimeout();
		try {
			currentTx = getTransactionManager().getTransaction();
			if(currentTx!=null) {
				getTransactionManager().suspend();
			}
			getTransactionManager().setTransactionTimeout(timeout);
			getTransactionManager().begin();
			task.run();
			getTransactionManager().commit();
		} catch (Exception e) {
			try { getTransactionManager().rollback(); } catch (Exception e2) {}
			throw new RuntimeException("executeInNewTX on instance of task [" + task.getClass().getName() + "] failed.", e);
		} finally {
			if(currentTx!=null) {
				try {
					getTransactionManager().resume(currentTx);
				} catch (Exception e) {
					LOG.error("Failed to resume transaction [" + currentTx + "]", e);
				}
			}
			try {
				getTransactionManager().setTransactionTimeout(currentTXTimeout);
			} catch (Exception e) {
				LOG.warn("Failed to reset TransactionTimeout to  [" + currentTXTimeout + "]", e);
			}
		}
	}
	
	/**
	 * Executes the passed Callable in a new transaction which is commited on successful completion or rolledback if the runnable execution throws an exception.
	 * If there is a transaction already in scope on call, it will be suspended and resumed on completion of this method. 
	 * @param task A callable task
	 * @return the return value of the callable
	 */
	public static <T> T executeInNewTX(Callable<T> task) {
		if(task==null) {
			throw new RuntimeException("executeInNewTX was passed a null task");
		}
		Transaction currentTx = null;
		try {
			currentTx = getTransactionManager().getTransaction();
			if(currentTx!=null) {
				getTransactionManager().suspend();
			}
			getTransactionManager().begin();
			T returnValue = task.call();
			getTransactionManager().commit();
			return returnValue;
		} catch (Exception e) {
			try { getTransactionManager().rollback(); } catch (Exception e2) {}
			throw new RuntimeException("executeInNewTX on instance of task [" + task.getClass().getName() + "] failed.", e);
		} finally {
			if(currentTx!=null) {
				try {
					getTransactionManager().resume(currentTx);
				} catch (Exception e) {
					LOG.error("Failed to resume transaction [" + currentTx + "]", e);
				}
			}
		}
	}
	

	/**
	 * Generates a formatted string representing the registered resources in the current transaction
	 * @return a formatted string representing the registered resources in the current transaction
	 */	
	public static String getTransactionResourcesDump() {
		return getTransactionResourcesDump(getCurrentTransaction());
	}
	
	/**
	 * Registers a synchronization against the passed transaction.
	 * @param tx The transaction to register with
	 * @param synch the synchronization to register
	 */
	public static void registerSynchronization(Transaction tx, Synchronization synch) {
		try {			
			tx.registerSynchronization(synch);
		} catch (Exception e) {
			throw new RuntimeException("Failed to register synchronization against tx [" + tx + "]", e);
		}
	}
	
	/**
	 * Registers a synchronization wrapped runnable against the passed transaction.
	 * @param tx The transaction to register with
	 * @param synch the synchronization runnable to register
	 * @param runOnStatus optional array of TXStatus. If this is null or zero length, the synchronization will fire on any status call back. If not, it will only fire on the passed statuses.
	 */
	public static void registerSynchronizationRunnable(Transaction tx, Runnable synch, TXStatus...runOnStatus) {
		try {
			String key = String.format("[%s]-[%s]-[%s]", "" + Thread.currentThread().getId(), "" + System.identityHashCode(synch), "" + random.nextLong());
			getTXRegistry().putResource(key, RunnableSynchronization.newInstance(synch, runOnStatus));
			//tx.registerSynchronization(RunnableSynchronization.newInstance(synch, runOnStatus));
		} catch (Exception e) {
			throw new RuntimeException("Failed to register synchronization wrapped runnable against tx [" + tx + "]", e);
		}
	}
	
	
	/**
	 * Registers a synchronization against the current transaction.
	 * @param synch the synchronization to register
	 */
	public static void registerSynchronization(Synchronization synch) {
		registerSynchronization(getCurrentTransaction(), synch);
	}
	
	
	/**
	 * Registers a synchronization wrapped runnable against the current transaction.
	 * @param synch the synchronization runnable to register
	 * @param runOnStatus optional array of TXStatus. If this is null or zero length, the synchronization will fire on any status call back. If not, it will only fire on the passed statuses.
	 * @return true if Synchronization was successfully registered.
	 */
	public static boolean registerSynchronizationRunnable(Runnable synch, TXStatus...runOnStatus) {
		Transaction tx = getCurrentTransaction();
		if(tx!=null) {
			registerSynchronization(getCurrentTransaction(), RunnableSynchronization.newInstance(synch, runOnStatus));
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Registers an interposed synchronization with the current transaction.
	 * The afterCompletion callback will be called after 2-phase commit completes but before any SessionSynchronization and Transaction afterCompletion callbacks. 
	 * @param synch The synchronization to register
	 * @param runOnStatus The TXStatus array on which the synchronization should fire. Null or an empty array means any status.
	 * @return true if the interposed synchronization was registered.
	 */
	public static void registerInterposedSynchronizationRunnable(Runnable synch, TXStatus...runOnStatus) {
			getTXRegistry().registerInterposedSynchronization(RunnableSynchronization.newInstance(synch, runOnStatus));
	}
	
	
	/**
	 * Registers an interposed synchronization
	 * @param interposedSynch the interposed synchronization
	 */
	public static void registerInterposedSynchronization(Synchronization interposedSynch) {
		getTXRegistry().registerInterposedSynchronization(interposedSynch);
	}
	

	

	
	
	/**
	 * Registers for a logging callback when the current transaction completes.
	 * @param txEndMessage The message to display
	 * @param runOnStatus The TX Statuses to fire on.
	 * @return true if the callback request was registered successfully.
	 */
	public static boolean registerSynchronizationRunnable(final CharSequence txEndMessage, TXStatus...runOnStatus) {
		final Transaction tx = getCurrentTransaction();
		final Date startTime = new Date();
		if(tx!=null) {
			registerSynchronization(getCurrentTransaction(), RunnableSynchronization.newInstance(new Runnable(){
				public void run() {
					Date endTime = new Date();
					TXStatus status = TXStatus.statusOf(tx);
					String txId = TransactionHelper.getTransactionUID(tx);
					StringBuilder b = new StringBuilder("\n\t================================\nTX Completion Audit Message\n\t================================");
					b.append("\n\tTransaction ID:").append(txId);
					b.append("\n\tTransaction State:").append(status.name());
					b.append("\n\tStart Time:").append(startTime);
					b.append("\n\tEnd Time:").append(endTime);
					b.append("\n\tTX End Message:").append(txEndMessage);	
					b.append("\n\t================================\n");
					LOG.info(b.toString());
				}
			}, runOnStatus));
			LOG.info("Registered TX Completion Notice Request for [" + TransactionHelper.getTransactionUID(tx) + "]");
			return true;
		} else {
			return false;
		}		
	}
	
	
	
	
	
	/**
	 * <p>Title: RunnableSynchronization</p>
	 * <p>Description: Utility class to wrap a runnable in a TX synchronization</p> 
	 * <p>Company: ICE Futures US</p>
	 * @author Whitehead (nicholas.whitehead@theice.com)
	 * @version $LastChangedRevision$
	 * <p><code>com.onexchange.tx.util.RunnableSynchronization</code></p>
	 */
	public static class RunnableSynchronization implements Runnable, Synchronization {
		protected final Runnable runnable;
		protected final TXStatus[] runOnStatus;
		protected TXStatus currentStatus = null;
		
		private RunnableSynchronization(Runnable runnable, TXStatus...runOnStatus) {
			this.runnable = runnable;
			this.runOnStatus = runOnStatus;
		}
		
		
		public static RunnableSynchronization newInstance(Runnable runnable, TXStatus...runOnStatus) {
			return new RunnableSynchronization(runnable, runOnStatus);
		}
		
		public void run() {
			runnable.run();
		}

		public void afterCompletion(int status) {
			try {
				txStat.set(TXStatus.decode(status));
				if(runOnStatus==null || runOnStatus.length < 1) {
					run();
				} else {
					TXStatus txStat = TXStatus.decode(status);
					for(TXStatus txs: runOnStatus) {
						if(txs.equals(txStat)) {
							run();
							break;
						}
					}
				}
			} finally {
				txStat.set(null);
			}
		}

		public void beforeCompletion() {
		}
		
	}
	

	/**
	 * Starts a transaction if one is not currently running.
	 */
	public static void startTXIfNoneRunning() {
		try {
			Transaction tx = getCurrentTransaction();
			if(tx==null || !TXStatus.statusOf(tx).isActive()) {
				getTransactionManager().begin();
			}
		} catch (Exception e) {
			LOG.warn("Failed to call startTXIfNoneRunning", e);
			throw new RuntimeException("Failed to call startTXIfNoneRunning", e);
		}
	}
	
	/**
	 * Commits a TX is one is running
	 */
	public static void stopTXIfOneIsRunning() {
		Transaction tx = null;
		try {
			tx = getCurrentTransaction();
			if(tx==null) return;
			if(tx!=null && TXStatus.statusOf(tx).isActive()) {
				try {
					getTransactionManager().commit();
				} catch (Exception e) {
					LOG.warn("Failed to call commit in stopTXIfOneIsRunning", e);
					try { getTransactionManager().rollback(); } catch (Exception ex) {}
				}
			} else {
				try { getTransactionManager().rollback(); } catch (Exception e) {}
			}
		} catch (Exception e) {
			LOG.warn("Failed to call stopTXIfOneIsRunning", e);			
		} finally {
			tx = getCurrentTransaction();
			if(tx!=null) {
				throw new RuntimeException("stopTXIfOneIsRunning failed to disassociate TX from thread", new Throwable());
			}
		}
	}



	
	/**
	 * <p>Title: TXStatus</p>
	 * <p>Description: Enumerator for transaction status</p> 
	 * @author Nicholas Whitehead
	 * <p><code>org.helios.jboss7.util.TransactionHelper.TXStatus</code></p>
	 */
	public static enum TXStatus {
		STATUS_ACTIVE(0, "STATUS_ACTIVE", false),
		STATUS_MARKED_ROLLBACK(1, "STATUS_MARKED_ROLLBACK", true),
		STATUS_PREPARED(2, "STATUS_PREPARED", false),
		STATUS_COMMITTED(3, "STATUS_COMMITTED", true),
		STATUS_ROLLEDBACK(4, "STATUS_ROLLEDBACK", true),
		STATUS_UNKNOWN(5, "STATUS_UNKNOWN", true),
		STATUS_NO_TRANSACTION(6, "STATUS_NO_TRANSACTION", true),
		STATUS_PREPARING(7, "STATUS_PREPARING", false),
		STATUS_COMMITTING(8, "STATUS_COMMITTING", true),
		STATUS_ROLLING_BACK(9, "STATUS_ROLLING_BACK", true),
		EXCEPTION_READING(998, "EXCEPTION_READING", false),
		NO_TRANSACTION(999, "NO_TRANSACTION", false);

		public static Map<Integer, TXStatus> decodes;
		
		static {
			Map<Integer, TXStatus> _decodes = new HashMap<Integer, TXStatus>(11);
			_decodes.put(0, STATUS_ACTIVE);
			_decodes.put(1, STATUS_MARKED_ROLLBACK);
			_decodes.put(2, STATUS_PREPARED);
			_decodes.put(3, STATUS_COMMITTED);
			_decodes.put(4, STATUS_ROLLEDBACK);
			_decodes.put(5, STATUS_UNKNOWN);
			_decodes.put(6, STATUS_NO_TRANSACTION);
			_decodes.put(7, STATUS_PREPARING);
			_decodes.put(8, STATUS_COMMITTING);
			_decodes.put(9, STATUS_ROLLING_BACK);		
			_decodes.put(998, EXCEPTION_READING);
			_decodes.put(999, NO_TRANSACTION);
			
			decodes = Collections.unmodifiableMap(_decodes);
		}
		
		private TXStatus(int status, String desc, boolean suspendForEnroll) {
			this.status = status;
			this.desc = desc;
			this.suspendForEnroll = suspendForEnroll; 
		}
		private final String desc;
		private final int status;
		private final boolean suspendForEnroll;

		
		/**
		 * Returns the descriptive name for this TXStatus
		 * @return the descriptive name for this TXStatus
		 */
		public String desc() { return desc; }
		/**
		 * Returns a TXStatus repreented by the status code passed in
		 * @param i the transaction status code 
		 * @return a TXStatus
		 */
		public static TXStatus decode(int i) { return decodes.get(i); }
		/**
		 * Returns a TXStatus repreenting the state of the passed transaction
		 * @param tx the transaction to get the TXStatus of 
		 * @return a TXStatus
		 */
		public static TXStatus statusOf(Transaction tx) {
			if(tx==null) {
				return NO_TRANSACTION;
			} else {
				try {
					return decode(tx.getStatus());
				} catch (Exception e) {
					return STATUS_UNKNOWN;
				}
			}
		}
		
		/**
		 * Returns the status code for this TXStatus
		 * @return the status code for this TXStatus
		 */
		public int getStatus() {
			return status;
		}
		/**
		 * Indicates if the transaction can be enrolled in or needs to be suspended.
		 * @return true if a suspend is required.
		 */
		public boolean isSuspendForEnroll() {
			return suspendForEnroll;
		}
		
		/**
		 * Indicates if the status of the transaction is considered active
		 * @return true if the transaction is active.
		 */
		public boolean isActive() {
			return STATUS_ACTIVE.equals(this);
		}
		
		/**
		 * Determines if the transaction is terminated
		 * @return true if the transaction is terminated
		 */
		public boolean isTerminated() {
			return (this.equals(STATUS_COMMITTED) || this.equals(STATUS_NO_TRANSACTION) || this.equals(STATUS_ROLLEDBACK));
		}

	}
}
