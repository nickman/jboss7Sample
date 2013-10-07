/**
 * beans
 */
package org.helios.jboss7.hibernate.domain;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>Title: MetricType</p>
 * <p>Description: Enumerates the supported metric types</p> 
 * @author Nicholas Whitehead
 * <p><code>org.helios.jboss7.hibernate.domain.MetricType</code></p>
 */
public enum MetricType {
	/** Standard numeric metricId type, conflation is additive */
	LONG_COUNTER,
	/** Standard numeric metricId type, conflation is averaging */
	LONG_GAUGE,	
	/** Locally maintained delta numeric metricId type, conflation is additive */
	DELTA_COUNTER,
	/** Locally maintained delta numeric metricId type, conflation is averaging */
	DELTA_GAUGE,
	/** Increments a server managed global counter */
	INCREMENTOR,
	/** Increments a server managed global counter which is flushed and zeroed out at the end of the interval */
	INTERVAL_INCREMENTOR;
	
	public static final Map<Integer, MetricType> ORD2ENUM;
	
	static {
		MetricType[] values = MetricType.values();
		Map<Integer, MetricType> tmp = new HashMap<Integer, MetricType>(values.length);
		for(MetricType mt: values) {
			tmp.put(mt.ordinal(), mt);
		}
		ORD2ENUM = Collections.unmodifiableMap(tmp);
	}
	
	
	public static MetricType decode(Object obj) {
		if(obj==null) throw new RuntimeException("The passed object was null");
		if(obj instanceof Number) {
			return ORD2ENUM.get(((Number)obj).intValue());
		} else {
			return MetricType.valueOf(obj.toString().trim().toUpperCase());
		}
	}
	
	public static void main(String[] args) {
		StringBuilder b = new StringBuilder();
		for(MetricType mt: values()) {
			b.append("MERGE INTO TRACE_TYPE KEY(TYPE_ID) VALUES(").append(mt.ordinal())
				.append(", '").append(mt.name()).append("');\n");
		}
		System.out.println(b);
		
	}

}
