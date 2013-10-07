package org.helios.jboss7.metrics;

import org.springframework.transaction.annotation.Transactional;

public interface IMetricProcessor {

	/**
	 * Processes an incoming metric
	 * @param metricInstance The string representation of a lightweight metric
	 */
	public abstract void process(CharSequence metricInstance);

}