#!/bin/bash
echo " ==========  Deploying ========="
pushd .
cd ../services
mvn clean install
popd
mvn clean package jboss-as:deploy


