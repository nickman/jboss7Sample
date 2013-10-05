/**
 * services
 */
package org.helios.jboss7.h2;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.h2.server.Service;
import org.h2.server.TcpServer;
import org.h2.server.web.WebServer;
import org.h2.tools.Server;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;

/**
 * <p>Title: H2ListenerController</p>
 * <p>Description: Utility class to simplify launching the H2 Web Console and JDBC TCP Listener</p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.h2.H2ListenerController</code></p>
 */
public class H2ListenerController implements ApplicationListener<ApplicationContextEvent> {
	/** Static class logger */
	private static Logger LOG = Logger.getLogger(H2ListenerController.class);
	
	/** The H2 DataSource to start listeners for */
	protected DataSource dataSource = null;
	
	/** The H2 connection used for the webListener */
	protected Connection conn = null;


	/** The web service */
	protected Service webService = null;
	/** The tcp service */
	protected Service tcpService = null;
	/** The pg service */
	protected Service pgService = null;
	/** The web server */
	protected Server webServer = null;
	/** The tcp server */
	protected Server tcpServer = null;
	/** The pg server */
	protected Server pgServer = null;
	
	
	/** The web listener port */
	protected int webPort = -1;
	/** The jdbc tcp listener port */
	protected int tcpPort = -1;
	/** The pg listener port */
	protected int pgPort = -1;
	

	/**
	 * {@inheritDoc}
	 * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
	 */
	@Override
	public void onApplicationEvent(ApplicationContextEvent event) {
		if(event instanceof ContextRefreshedEvent) {
			LOG.info("Processing ContextRefereshed Event");
			startServers();
		} else if(event instanceof ContextClosedEvent) {
			LOG.info("Processing ContextClosedEvent Event");
			stopServers();
		}
	}
	
	/*

	[-help] or [-?]	Print the list of options
	[-web]	Start the web server with the H2 Console
	[-webAllowOthers]	Allow other computers to connect - see below
	[-webPort <port>]	The port (default: 8082)
	[-webSSL]	Use encrypted (HTTPS) connections
	[-browser]	Start a browser and open a page to connect to the web server
	[-tcp]	Start the TCP server
	[-tcpAllowOthers]	Allow other computers to connect - see below
	[-tcpPort <port>]	The port (default: 9092)
	[-tcpSSL]	Use encrypted (SSL) connections
	[-tcpPassword <pwd>]	The password for shutting down a TCP server
	[-tcpShutdown "<url>"]	Stop the TCP server; example: tcp://localhost:9094
	[-tcpShutdownForce]	Do not wait until all connections are closed
	[-pg]	Start the PG server
	[-pgAllowOthers]	Allow other computers to connect - see below
	[-pgPort <port>]	The port (default: 5435)
	[-baseDir <dir>]	The base directory for H2 databases; for all servers
	[-ifExists]	Only existing databases may be opened; for all servers
	[-trace]	Print additional trace information; for all servers
		
	 */	
	
	protected void startServers() {
		if(webPort>0) {
			webService = new WebServer();
			try {
				conn = dataSource.getConnection();				
				webServer = new Server(webService, "-web", "-webAllowOthers", "-webPort", "" + webPort);
				((WebServer)webService).addSession(conn);				
				webServer.start();
				LOG.info("Started H2 Web Console on port [" + webPort + "]");
			} catch (SQLException e) {
				LOG.error("Failed to start H2 WebService", e);
			}			
		}
		if(tcpPort>0) {
			tcpService = new TcpServer();
			try {
				//conn = dataSource.getConnection();				
				tcpServer = new Server(tcpService, "-tcp", "-tcpAllowOthers", "-tcpPort", "" + tcpPort);
				
				tcpServer.start();
				
				LOG.info("Started H2 TCP Listener on port [" + tcpPort + "]  --> [" + tcpServer.getURL() + "]");
			} catch (SQLException e) {
				LOG.error("Failed to start H2 TcpService", e);
			}			
		}
		
	}
	
	protected void stopServers() {
		if(webServer!=null) {
			webServer.stop();
			webPort = -1;
			LOG.info("Stopped H2 Web Console");
		}
		if(conn!=null) {
			try { conn.close(); } catch (Exception ex) {}
			conn = null;
		}
		if(tcpServer!=null) {
			tcpServer.stop();
			tcpPort = -1;
			LOG.info("Stopped H2 Tcp Listener");
		}
	}
	
	/**
	 * Returns the webPort
	 * @return the webPort
	 */
	public int getWebPort() {
		return webPort;
	}


	/**
	 * Sets the webPort
	 * @param webPort the webPort to set
	 */
	public void setWebPort(int webPort) {
		this.webPort = webPort;
	}


	/**
	 * Returns the tcpPort
	 * @return the tcpPort
	 */
	public int getTcpPort() {
		return tcpPort;
	}


	/**
	 * Sets the tcpPort
	 * @param tcpPort the tcpPort to set
	 */
	public void setTcpPort(int tcpPort) {
		this.tcpPort = tcpPort;
	}


	/**
	 * Returns the pgPort
	 * @return the pgPort
	 */
	public int getPgPort() {
		return pgPort;
	}


	/**
	 * Sets the pgPort
	 * @param pgPort the pgPort to set
	 */
	public void setPgPort(int pgPort) {
		this.pgPort = pgPort;
	}

	/**
	 * Returns the dataSource
	 * @return the dataSource
	 */
	public DataSource getDataSource() {
		return dataSource;
	}

	/**
	 * Sets the dataSource
	 * @param dataSource the dataSource to set
	 */
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}	

}
