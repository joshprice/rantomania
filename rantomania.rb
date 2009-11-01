require 'rubygems'
require 'compass'
require 'sinatra'
require 'haml'
require 'pg'
require 'pp'
require 'activerecord'

set :haml, {:format => :html5 }

dbconfig = YAML.load(File.read('config/database.yml'))
pp dbconfig['development']

class Rant < ActiveRecord::Base
end

ActiveRecord::Base.establish_connection(:adapter => 'postgresql', :database => "rantomania_development")

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :"stylesheets/#{params[:name]}", Compass.sass_engine_options
end

before do
  @rants = Rant.all :order => 'id desc'
end

get '/' do
  haml :index
end

post '/rant' do
  pp params
  if params['rant']
    Rant.create(:rant => params['rant'])
  else
    puts "Where's your data mother fucker"
  end
end
  
not_found do
  redirect '/'
end
