@echo off
cd ..\services
call mvn clean install
cd ..\ear
mvn clean package jboss-as:deploy
