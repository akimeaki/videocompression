FROM denoland/deno:2.3.5

RUN apt-get update && apt-get install -y curl gnupg \
	&& curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&& apt-get install -y nodejs ffmpeg \
	&& npm install -g n \
	&& n 20.15.0 \
	&& apt-get clean && rm -rf /var/lib/apt/lists/*
