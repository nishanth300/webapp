FROM tomcat:9.0
COPY target/WEBAPP.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8084
CMD ["catalina.sh","run"]
