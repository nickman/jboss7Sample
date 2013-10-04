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
import java.io.FileOutputStream;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.helios.jboss7.spring.SpringAppCtxManager;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.formatter.Formatters;
import org.jboss.shrinkwrap.api.spec.EnterpriseArchive;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;
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
	protected final Logger log = Logger.getLogger(getClass());
	/** The currently executing test name */
	@Rule public final TestName name = new TestName();

	@Deployment
    public static JavaArchive createDeployment() {
		PomEquippedResolveStage resolved = Maven.resolver().loadPomFromFile("../ear/pom.xml");
		// org.helios.jboss7:ear:1.0-SNAPSHOT
		EnterpriseArchive ea = ShrinkWrap.create(EnterpriseArchive.class, "test.ear")
			.addAsDirectories("../ear/target/sample.ear");
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream("/tmp/a.ear");
			ea.writeTo(fos, Formatters.SIMPLE);
		} catch (Exception ex) {
			ex.printStackTrace(System.err);
		} finally {
			if(fos!=null) try { fos.close(); } catch (Exception ex) {}
		}
			
        return ShrinkWrap.create(JavaArchive.class, "test.jar")
            .addClasses(SpringAppCtxManager.class)     
            
            .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml");
    }
	
	public static void main(String[] args) {
		BasicConfigurator.configure();		
		Logger LOG = Logger.getLogger(BaseTest.class);
		LOG.info("Starting Maven Resolver Test");
		File[] files = Maven.resolver().offline().resolve("org.helios.jboss7:ear:ear:1.0-SNAPSHOT").withTransitivity().asFile();
//		PomEquippedResolveStage resolved = Maven.resolver().offline().loadPomFromFile("../ear/pom.xml").importRuntimeDependencies();
//		MavenFormatStage mss = resolved.resolve("org.helios.jboss7:ear:1.0-SNAPSHOT").withoutTransitivity();
		for(File f : files) {
			LOG.info(f.getAbsolutePath());
		}
		
	}
	
	/**
	 * Prints the test name about to be executed
	 */
	@Before
	public void printTestName() {
		log.info("\n\t==================================\n\tRunning Test [" + name.getMethodName() + "]\n\t==================================\n");
	}
	

	@Test
	public void testGetRootContext() {
		
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