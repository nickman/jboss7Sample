DROP TABLE IF EXISTS EVENTDEPENDENCY CASCADE;
DROP TABLE IF EXISTS EVENT CASCADE;
DROP SEQUENCE IF EXISTS EVENT_SEQ;
DROP SEQUENCE IF EXISTS EVENT_DEP_SEQ;

CREATE SEQUENCE EVENT_SEQ;
CREATE SEQUENCE EVENT_DEP_SEQ;

CREATE TABLE LOG (
	MESSAGE   VARCHAR2(2000) NOT NULL
);

CREATE TABLE EVENT (
    EVENT_NAME   VARCHAR2(32) NOT NULL PRIMARY KEY,
    DESCRIPTION  VARCHAR2(256),
    CLASS_NAME   VARCHAR2(256) NOT NULL,
    DISPLAY_NAME VARCHAR2(64) NOT NULL,
    SEQ_NUMBER   NUMBER(5,0) NOT NULL,
    STATE        VARCHAR2(32) NOT NULL,
    RESET_STATE  VARCHAR2(32) NOT NULL,
    EVENT_DATA   VARCHAR2(256),
    UPDATE_TS TIMESTAMP,
    CREATE_TS TIMESTAMP NOT NULL    
  );
  
CREATE TABLE EVENTDEPENDENCY (
    EVENT_NAME     VARCHAR2(32) NOT NULL,
    DEP_EVENT_NAME VARCHAR2(32) NOT NULL REFERENCES EVENT(EVENT_NAME),
    STATE          VARCHAR2(32),
    SEQ_NUMBER     NUMBER(5,0) NOT NULL,
    UPDATE_TS TIMESTAMP,
    CREATE_TS TIMESTAMP NOT NULL    
  );
  
  CREATE PRIMARY KEY ON EVENTDEPENDENCY(EVENT_NAME, DEP_EVENT_NAME);
  
Insert into EVENT values ('test.event','test.event description','com.theice.bec.event.Event','Test Event',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW',null, null, SYSDATE);
Insert into EVENT values ('test.event.a','test.event.a description','com.theice.bec.event.impls.TestEventA','TestEventA',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW',null, null, SYSDATE);
Insert into EVENT values ('test.event.b','test.event.b description','com.theice.bec.event.impls.TestEventB','TestEventA',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW',null, null, SYSDATE);
INSERT INTO EVENT VALUES ('ecs.interest-rates','Whether or not the interest rate board has been marked ready for settlement','com.theice.bec.event.impls.TestEventA','Interest Rate Board',EVENT_SEQ.NEXTVAL,'PENDING','PENDING','17227','2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.currency-rates','Whether or not the currency rate board has been marked for settlement','com.theice.bec.event.impls.TestEventB','Currency Rate Board',EVENT_SEQ.NEXTVAL,'COMPLETE','PENDING','42763','2011-09-02','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.admin','Block or allow CHAdmin GUI entries','com.theice.bec.event.impls.TestEventA','Admin Desk',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.end-user','Block or allow CHMember GUI entries','com.theice.bec.event.impls.TestEventB','End-User Desk',EVENT_SEQ.NEXTVAL,'NOT_ALLOW','ALLOW', NULL, '2011-09-27','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.asset-prices','Whether or not the asset price board has been marked ready for settlement','com.theice.bec.event.Event','Asset PriceBoard',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.positions','Whether or not the TRSPositions file has been imported','com.theice.bec.event.impls.TestEventA','TRS Positions Import',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.swift','Check that all ISG swift requests are cleared from the bridge and resolved','com.theice.bec.event.impls.TestEventB','Swift Requests',EVENT_SEQ.NEXTVAL,'NA','NA', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('billing.state','Current state of the billing data','com.theice.bec.event.Event','Billing State',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('deliveries.state','Current state of the delivery data','com.theice.bec.event.impls.TestEventA','Deliveries State',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.pre-eod-check','Check all EOD Settlement dependencies that must be run prior to doing the pre-eod-db-backup','com.theice.bec.event.impls.TestEventB','Pre-End-of-Day Check',EVENT_SEQ.NEXTVAL,'COMPLETE','PENDING', NULL, '2011-09-14','2008-02-13');
INSERT INTO EVENT VALUES ('db.pre-eod-backup','Whether or not the pre-eod-db-backup script has run','com.theice.bec.event.NoStateCacheEvent','Pre-End-of-Day Backup DB Script',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.end-of-day','The state of the EOD settlement run','com.theice.bec.event.impls.TestEventA','End-of-Day Settlement',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('db.post-eod-backup','Whether or not the post-eod-db-backup script has run','com.theice.bec.event.NoStateCacheEvent','Post-End-of-Day Backup DB Script',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.new-day','EOD Settlement and backups are complete, and event system has been reset to start-of-day values','com.theice.bec.event.Event','New Day Reset',EVENT_SEQ.NEXTVAL,'COMPLETE','COMPLETE', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.intraday-us','The state of the intraday us settlement run','com.theice.bec.event.impls.TestEventA','Intraday US Settlement',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.intraday-uk','The state of the intraday uk settlement run','com.theice.bec.event.impls.TestEventB','Intraday UK Settlement',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2008-02-13');
INSERT INTO EVENT VALUES ('ecs.roll-day','Checks that the day can be rolled by a settlement run','com.theice.bec.event.Event','Roll Day Check',EVENT_SEQ.NEXTVAL,'NA','NA', NULL, '2011-08-24','2008-08-07');
INSERT INTO EVENT VALUES ('ecs.ecs-restarted','ECS restarted','com.theice.bec.event.impls.TestEventA','ECS restarted',EVENT_SEQ.NEXTVAL,'COMPLETE','COMPLETE', NULL, '2011-09-15','2009-02-26');
INSERT INTO EVENT VALUES ('ecs.cds-requirements','Whether or not Credit Default Swap Requirements have been imported','com.theice.bec.event.impls.TestEventB','CDS Requirements Import',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2009-05-13');
INSERT INTO EVENT VALUES ('ecs.cds-variation','Whether or not Credit Default Swap MTM Requirements have been imported','com.theice.bec.event.Event','CDS MTM Import',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2009-05-13');
INSERT INTO EVENT VALUES ('ecs.assetDWRequests','Check that all Triparty Collateral asset DW requests are not in pending confirm state','com.theice.bec.event.impls.TestEventA','Triparty Collateral AssetDW Requests',EVENT_SEQ.NEXTVAL,'NA','NA', NULL, '2011-08-24','2009-10-21');
INSERT INTO EVENT VALUES ('ecs.asset-ref-data','Records whether Bloomberg reference data was imported','com.theice.bec.event.impls.TestEventB','Bloomberg Reference Data',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2009-07-08');
INSERT INTO EVENT VALUES ('ecs.asset-price-import','Records whether Bloomberg price data was imported','com.theice.bec.event.Event','Bloomberg Price Data',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2009-07-08');
INSERT INTO EVENT VALUES ('deliveries.flex-eod-state','Flex Delivery system EOD State','com.theice.bec.event.impls.TestEventA','Flex delivery system EOD',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2009-03-12');
INSERT INTO EVENT VALUES ('CRD.position-combination-import','Position Combination File Import','com.theice.bec.event.impls.TestEventB','Position Combination File Import',EVENT_SEQ.NEXTVAL,'OPEN','OPEN', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.account-management','Account Management','com.theice.bec.event.Event','Account Management',EVENT_SEQ.NEXTVAL,'NOT_ALLOW','ALLOW', NULL, '2011-09-28','2011-04-08');
INSERT INTO EVENT VALUES ('ECSGATEWAY.listeners-state','Current state of the EcsGateway','com.theice.bec.event.impls.TestEventA','EcsGateway State',EVENT_SEQ.NEXTVAL,'STOP','NA', NULL, '2011-06-24','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.prices','Whether or not the price board has been marked for settlement','com.theice.bec.event.impls.TestEventB','Price Board',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('MS.fs.risk-arrays-published','Margin Service Risk Arrays Published','com.theice.bec.event.Event','Margin Service Risk Array',EVENT_SEQ.NEXTVAL,'NOT_READY','NOT_READY', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.get-prices.N/A','Retrieval of Real-time Prices from Price Service','com.theice.bec.event.impls.TestEventA','Get Real-time Prices',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.get-prices','Retrieval of Prices from Price Service','com.theice.bec.event.impls.TestEventB','Get Prices',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.am-adjustment-entry','AM Adjustment Entry','com.theice.bec.event.Event','AM Adjustment Entry',EVENT_SEQ.NEXTVAL,'NOT_ALLOW','ALLOW', NULL, '2011-09-28','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.am-positions-ready','Open interest publishing','com.theice.bec.event.impls.TestEventA','Open interest publishing',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('FEC.end-of-day','FEC End of Day','com.theice.bec.event.impls.TestEventB','FEC End of Day',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2011-04-08');
INSERT INTO EVENT VALUES ('ecs.pm-pcs-entry','Access to PM PCS Screens','com.theice.bec.event.Event','PM PCS Entry',EVENT_SEQ.NEXTVAL,'ALLOW','NOT_ALLOW', NULL, '2011-09-28','2011-04-08');
INSERT INTO EVENT VALUES ('MS.pre-eod-check','Margin Service pre EOD check','com.theice.bec.event.impls.TestEventA','Margin Service EOD',EVENT_SEQ.NEXTVAL,'NOT_READY','NOT_READY', NULL, '2011-08-24','2010-08-21');
INSERT INTO EVENT VALUES ('ecs.product','Product Management','com.theice.bec.event.impls.TestEventB','Product Management',EVENT_SEQ.NEXTVAL,'NOT_ALLOW','ALLOW', NULL, '2011-09-28','2010-08-21');
INSERT INTO EVENT VALUES ('PS.pre-eod-check','Price Service did its Pre-EOD Check','com.theice.bec.event.Event','Price Service Done',EVENT_SEQ.NEXTVAL,'NOT_READY','NOT_READY', NULL, '2011-08-24','2010-08-21');
INSERT INTO EVENT VALUES ('ecs.position-management','Position Management','com.theice.bec.event.impls.TestEventA','Position Management',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2010-08-21');
INSERT INTO EVENT VALUES ('ecs.contract-import','ICE/Oracle Contract Importer','com.theice.bec.event.impls.TestEventB','ICE/Oracle Contract Importer',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2010-08-21');
INSERT INTO EVENT VALUES ('CRD.contract-feed','Whether CRD has finished contracts','com.theice.bec.event.Event','CRD Contract Feed',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2010-08-21');
INSERT INTO EVENT VALUES ('ecs.published-currency-rates','Currency Rates Published','com.theice.bec.event.impls.TestEventA','Currency Rates Published',EVENT_SEQ.NEXTVAL,'COMPLETE','PENDING', NULL, '2011-09-02','2010-08-21');
INSERT INTO EVENT VALUES ('ecs.expiration-runs','Intraday Expiration Runs','com.theice.bec.event.impls.TestEventB','Intraday Expiration Runs',EVENT_SEQ.NEXTVAL,'OPEN','OPEN', NULL, '2011-08-24','2011-07-13');
INSERT INTO EVENT VALUES ('ecs.pm-option-exercise-entry','PM Option Exercise Entry','com.theice.bec.event.Event','PM Option Exercise Entry',EVENT_SEQ.NEXTVAL,'ALLOW','ALLOW', NULL, '2011-08-24','2011-07-13');
INSERT INTO EVENT VALUES ('ecs.pcsimport','Check that all PCS Imports Are Complete Or Failed','com.theice.bec.event.impls.TestEventA','PCS Imports',EVENT_SEQ.NEXTVAL,'NA','NA', NULL, '2011-08-24','2011-08-24');
INSERT INTO EVENT VALUES ('BILLING.billing.state','Current state of the billing data','com.theice.bec.event.impls.TestEventB','Billing State',EVENT_SEQ.NEXTVAL,'PENDING','PENDING', NULL, '2011-08-24','2011-08-24');
INSERT INTO EVENT VALUES ('DICE.deliveries.state','Current state of the delivery data','com.theice.bec.event.Event','Deliveries State',EVENT_SEQ.NEXTVAL,'COMPLETE','PENDING', NULL, '2011-09-15','2011-08-24');




Insert into EVENTDEPENDENCY values ('test.event','test.event.a','COMPLETE',EVENT_DEP_SEQ.NEXTVAL,null,SYSDATE);
Insert into EVENTDEPENDENCY values ('test.event','test.event.b','COMPLETE',EVENT_DEP_SEQ.NEXTVAL,null,SYSDATE);
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','deliveries.flex-eod-state','COMPLETE', EVENT_DEP_SEQ.NEXTVAL,'2010-08-21','2009-03-12');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.swift','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','BILLING.billing.state','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','deliveries.state','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.asset-prices','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.interest-rates','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.currency-rates','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.positions','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.admin','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.end-user','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('db.pre-eod-backup','ecs.pre-eod-check','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.end-of-day','db.pre-eod-backup','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('db.post-eod-backup','ecs.end-of-day','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.new-day','db.post-eod-backup','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-us','ecs.asset-prices','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-us','ecs.currency-rates','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-us','ecs.admin','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-uk','ecs.asset-prices','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-uk','ecs.currency-rates','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-uk','ecs.admin','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-02-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-us','ecs.pre-eod-check','PENDING', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-06-11');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.intraday-uk','ecs.pre-eod-check','PENDING', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-06-11');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.roll-day','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2008-08-07');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.new-day','ecs.ecs-restarted','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2009-02-26');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.cds-requirements','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2009-05-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.cds-variation','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2009-05-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.assetDWRequests','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2009-10-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.asset-ref-data','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2009-07-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.asset-price-import','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2009-07-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','CRD.position-combination-import','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.account-management','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ECSGATEWAY.listeners-state','STOP', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.pm-pcs-entry','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','FEC.end-of-day','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.prices','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.am-adjustment-entry','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-04-08');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','MS.pre-eod-check','READY', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.product','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','PS.pre-eod-check','READY', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.position-management','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.contract-import','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','CRD.contract-feed','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.published-currency-rates','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2010-08-21');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.expiration-runs','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-07-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.pm-option-exercise-entry','NOT_ALLOW', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-07-13');
INSERT INTO EVENTDEPENDENCY VALUES ('ecs.pre-eod-check','ecs.pcsimport','COMPLETE', EVENT_DEP_SEQ.NEXTVAL, NULL, '2011-08-24');




/*
SELECT 'INSERT INTO EVENT VALUES (''' || EVENT_NAME || ''','''  ||  DESCRIPTION  || ''','''  || decode(mod(rownum, 3), 0, 'com.theice.bec.event.Event', 1, 'com.theice.bec.event.impls.TestEventA', 'com.theice.bec.event.impls.TestEventB')
|| ''',''' || DISPLAY_NAME || ''',' || EVENT_SEQ.NEXTVAL || ',''' || STATE || ''',''' || RESET_STATE || ''',''' || EVENT_DATA
|| ''',''' || TO_CHAR(UPDATE_TS, 'YYYY-MM-DD') || ''',''' || TO_CHAR(CREATE_TS, 'YYYY-MM-DD') || ''');'  FROM EVENT WHERE EVENT_DATA IS NOT NULL
UNION ALL 
SELECT 'INSERT INTO EVENT VALUES (''' || EVENT_NAME || ''','''  ||  DESCRIPTION  || ''','''  || decode(mod(rownum, 3), 0, 'com.theice.bec.event.Event', 1, 'com.theice.bec.event.impls.TestEventA', 'com.theice.bec.event.impls.TestEventB')
|| ''',''' || DISPLAY_NAME || ''',' || EVENT_SEQ.NEXTVAL || ',''' || STATE || ''',''' || RESET_STATE || ''', NULL, ' 
|| '''' || TO_CHAR(UPDATE_TS, 'YYYY-MM-DD') || ''',''' || TO_CHAR(CREATE_TS, 'YYYY-MM-DD') || ''');'  FROM EVENT WHERE EVENT_DATA IS NULL

SELECT 'INSERT INTO EVENTDEPENDENCY VALUES (''' || EVENT_NAME || ''','''  ||  DEP_EVENT_NAME  || ''','''  || STATE
|| ''', ' || 'EVENT_DEP_SEQ.NEXTVAL' || ',''' || TO_CHAR(UPDATE_TS, 'YYYY-MM-DD') || ''',''' || TO_CHAR(CREATE_TS, 'YYYY-MM-DD') || ''');' 
FROM EVENTDEPENDENCY ED WHERE UPDATE_TS IS NOT NULL AND EXISTS (SELECT EVENT_NAME FROM  EVENT E WHERE E.EVENT_NAME = ED.EVENT_NAME)
UNION ALL 
SELECT 'INSERT INTO EVENTDEPENDENCY VALUES (''' || EVENT_NAME || ''','''  ||  DEP_EVENT_NAME  || ''','''  || STATE
|| ''', ' || 'EVENT_DEP_SEQ.NEXTVAL' || ', NULL, ' || '''' || TO_CHAR(CREATE_TS, 'YYYY-MM-DD') || ''');' 
FROM EVENTDEPENDENCY ED WHERE UPDATE_TS IS NULL AND EXISTS (SELECT EVENT_NAME FROM  EVENT E WHERE E.EVENT_NAME = ED.EVENT_NAME)

*/