FROM node:8.11.1

ENV JAVA_HOME /usr/lib/jvm/java-8-oracle
RUN apt-get update && \
  apt-get install -y --no-install-recommends locales && \
  locale-gen en_US.UTF-8 && \
  echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | debconf-set-selections && \
  echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" > /etc/apt/sources.list.d/webupd8team-java-trusty.list && \
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886 && \
  apt-get update && \
  apt-get install -y --no-install-recommends oracle-java8-installer oracle-java8-set-default

USER node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /app

RUN echo "Installing CDT2..."
RUN npm install --force -g cdt2 --registry http://presentation-layer.lmera.ericsson.se/registry --proxy null
RUN npm install --force -g cdt-build --registry http://presentation-layer.lmera.ericsson.se/registry --proxy null
RUN npm install --force -g cdt-package --registry http://presentation-layer.lmera.ericsson.se/registry --proxy null
RUN npm install --force -g cdt-serve --registry http://presentation-layer.lmera.ericsson.se/registry --proxy null
RUN npm install --force -g cdt-skeleton --registry http://presentation-layer.lmera.ericsson.se/registry --proxy null
RUN echo "Installation done."

COPY . .

USER root

RUN chmod +x /app/root/scripts/buildMe.sh
RUN cd /app/root/scripts && ./buildMe.sh

FROM armdocker.rnd.ericsson.se/proj-orchestration-sd-assurance/sd-base-image:1.0.0-1

#Install Apache server
RUN yum -y update
RUN yum -y install httpd-2.4.6

# Copy UI
#COPY /httpd.conf /etc/httpd/conf/httpd.conf
COPY --from=0 /app/ /var/www/html/
COPY --from=0 /app/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=0 /app/root/target/deploymentRoot /var/www/html/

#To remove redhat test page from being displayed.
RUN echo " " > /etc/httpd/conf.d/welcome.conf

CMD ["/usr/sbin/apachectl", "-D", "FOREGROUND"]
