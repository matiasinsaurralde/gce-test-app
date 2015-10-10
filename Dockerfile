# Dockerfile extending the generic Node image with application files for a
# single application.
FROM gcr.io/google_appengine/nodejs

# Uncomment and customize these if you're copying this by hand (use "app
# gen-config" to generate a Dockerfile.
# ADD package.json npm-shrinkwrap.json* /app/
# RUN npm --unsafe-perm install
# ADD . /app
COPY package.json /app/
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
RUN npm --unsafe-perm install
COPY . /app/
CMD npm start
