# README


rails new my_api --api

https://github.com/simi/omniauth-facebook/issues/324
https://github.com/heartcombo/devise/wiki/OmniAuth:-Overview
https://github.com/heartcombo/devise#omniauth
https://www.bootrails.com/blog/ruby-on-rails-authentication-tutorial-with-devise/
https://devtut.github.io/rubyonrails/authenticate-api-using-devise.html#getting-started
https://guides.rubyonrails.org/api_app.html

gem 'devise'
gem 'omniauth-azure-activedirectory-v2'


https://portal.azure.com/#home

rails generate devise:install
rails g devise User

rails g migration AddOmniauthToUsers provider:string uid:string

rails db:migrate

  config.omniauth :azure_activedirectory_v2,
    client_id:     ENV['AZURE_CLIENT_ID'],                                                              
    client_secret: ENV['AZURE_CLIENT_SECRET'],                                                         
    tenant_id:     ENV['AZURE_TENANT_ID']
	
devise :omniauthable, omniauth_providers:          
    %i[azure_activedirectory_v2]
	
	
EDITOR="vi" bin/rails credentials:edit
AZURE_CLIENT_SECRET: 

https://dev.to/vvo/secrets-environment-variables-config-files-the-ruby-on-rails-case-433f#:~:text=Here%27s%20the%20tl%3Bdr%3B%20for%20you%3A%201%20Rails%20credentials,you%20would%20have%20to%20create%20it%29%20More%20items

TBD
