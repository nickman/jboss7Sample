/**
 * Helios, OpenSource Monitoring
 * Brought to you by the Helios Development Group
 *
 * Copyright 2007, Helios Development Group and individual contributors
 * as indicated by the @author tags. See the copyright.txt file in the
 * distribution for a full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org. 
 *
 */
package org.helios.jboss7.base;

import java.io.File;
import java.lang.management.ManagementFactory;

import javax.management.MBeanServer;
import javax.management.ObjectName;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.EnterpriseArchive;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestName;

import org.junit.runner.RunWith;

/**
 * <p>Title: BaseTest</p>
 * <p>Description: </p> 
 * <p>Company: Helios Development Group LLC</p>
 * @author Whitehead (nwhitehead AT heliosdev DOT org)
 * <p><code>org.helios.jboss7.base.BaseTest</code></p>
 */
@RunWith(Arquillian.class)
public class BaseTest {
	/** Instance logger */
	protected static final Logger log = Logger.getLogger(BaseTest.class);
	/** The currently executing test name */
	@Rule public final TestName name = new TestName();
	
	public static final MBeanServer SERVER = ManagementFactory.getPlatformMBeanServer();
	

	@Deployment
    public static EnterpriseArchive createDeployment() {
		log.info("Generating Test EAR");
		//PomEquippedResolveStage resolved = Maven.resolver().loadPomFromFile("../ear/pom.xml");
		// org.helios.jboss7:ear:1.0-SNAPSHOT
		File earFile = new File("../ear/target/sample-ear.ear");
		JavaArchive testJar = ShrinkWrap.create(JavaArchive.class, "test-classes.jar")
				.addClasses(BaseTest.class)
				.addAsDirectory(".\target\test-classes");
		return ShrinkWrap.createFromZipFile(EnterpriseArchive.class, earFile)
				
				.addAsManifestResource(new File("./src/test/resources/application.xml"))
				.addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml")
				.addAsModules(testJar);

    }
	
	static {
		//BasicConfigurator.configure();
	}
	
	public static void main(String[] args) {
		BasicConfigurator.configure();		
		Logger LOG = Logger.getLogger(BaseTest.class);
		createDeployment();
		
	}
	
	/**
	 * Prints the test name about to be executed
	 */
	@Before
	public void printTestName() {
		log.info("\n\t==================================\n\tRunning Test [" + name.getMethodName() + "]\n\t==================================\n");
	}
	

	@Test
	public void testGetRootContext() throws Exception {
		//Class<?> clazz = Class.forName("org.helios.jboss7.spring.SpringRootContext");
		ObjectName on = new ObjectName("org.helios.jboss7.spring.context:service=ApplicationContextService");
		//ApplicationContext ctx = (ApplicationContext)
		Object obj = SERVER.getAttribute(on, "Instance");
		log.info("==== Running testGetRootContext: [" + obj.getClass().getName() + "] ====");
	}

}

/*
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}
	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}
	@Before
	public void setUp() throws Exception {
	}
	@After
	public void tearDown() throws Exception {
	}
 
*/