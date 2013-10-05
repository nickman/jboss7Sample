#!/bin/bash
echo " ==========  Building ========="
pushd .
cd ../services
mvn clean install
popd
mvn clean package 


