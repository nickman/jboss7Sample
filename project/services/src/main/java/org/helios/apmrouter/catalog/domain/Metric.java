package org.helios.apmrouter.catalog.domain;

// Generated Oct 27, 2012 1:30:47 PM by Hibernate Tools 3.6.0

import java.util.Arrays;
import java.util.Date;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Metric generated by hbm2java
 */
//@Document
public class Metric implements java.io.Serializable, DomainObject {

	@SerializedName("id")
	//@Indexed(unique=true)
	//@Id	
	private long metricId;
	@SerializedName("type")
	//@DBRef
	private TraceType traceType;
	@SerializedName("ag")
	//@DBRef
	private Agent agent;
	@SerializedName("ns")
	private String namespace;
	@SerializedName("narr")
	private String[] narr;
	@SerializedName("lev")
	private int level;
	@SerializedName("name")
	private String name;
	@Expose(serialize=false)
	private Date firstSeen;
	@SerializedName("state")
	private byte state;
	
	@Expose(serialize=false)
	private Date lastSeen;

	public Metric() {
	}

	public Metric(TraceType traceType, Agent agent, int level, Date firstSeen, byte state) {
		this.traceType = traceType;
		this.agent = agent;
		this.level = level;
		this.firstSeen = firstSeen;
		this.state = state;
	}

	public Metric(TraceType traceType, Agent agent, String namespace, String[] narr, 
			int level, String name, Date firstSeen, byte state, Date lastSeen) {
		this.traceType = traceType;
		this.agent = agent;
		this.namespace = namespace;
		this.narr = narr;
		this.level = level;
		this.name = name;
		this.firstSeen = firstSeen;
		this.state = state;;
		this.lastSeen = lastSeen;
	}
	
	
	

	public long getMetricId() {
		return this.metricId;
	}

	public void setMetricId(long metricId) {
		this.metricId = metricId;
	}

	public TraceType getTraceType() {
		return this.traceType;
	}

	public void setTraceType(TraceType traceType) {
		this.traceType = traceType;
	}

	public Agent getAgent() {
		return this.agent;
	}

	public void setAgent(Agent agent) {
		this.agent = agent;
	}

	public String getNamespace() {
		return this.namespace;
	}
	
	
	public byte getState() {
		return state;
	}
	
	public void setState(byte state) {
		this.state = state;
	}
	

	public void setNamespace(String namespace) {
		this.namespace = namespace;
	}

	public int getLevel() {
		return this.level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getFirstSeen() {
		return this.firstSeen;
	}

	public void setFirstSeen(Date firstSeen) {
		this.firstSeen = firstSeen;
	}

	public Date getLastSeen() {
		return this.lastSeen;
	}

	public void setLastSeen(Date lastSeen) {
		this.lastSeen = lastSeen;
	}

	/**
	 * {@inheritDoc}
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Metric [metricId=");
		builder.append(metricId);
		builder.append(", namespace=");
		builder.append(namespace);
		builder.append(", narr=");
		builder.append(Arrays.toString(narr));
		builder.append(", name=");
		builder.append(name);
		builder.append(", type=");
		builder.append(traceType.getTypeName());
		builder.append(", agent=");
		builder.append(agent.getName());
		builder.append(", host=");
		builder.append(agent.getHost().getName());
		builder.append(", level=").append(getLevel());		
		builder.append("]");
		return builder.toString();
	}

	/**
	 * Returns 
	 * @return the narr
	 */
	public String[] getNarr() {
		return narr;
	}

	/**
	 * Sets 
	 * @param narr the narr to set
	 */
	public void setNarr(String[] narr) {
		this.narr = narr;
	}

	
	
}
