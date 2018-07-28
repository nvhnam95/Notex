from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django import forms
from Notex.forms import LoginForm, RegisterForm

def home(request):
    if request.method == "POST":
        login_form = LoginForm(method.POST)
        register_form = RegisterForm(method.POST)
        return HttpResponseRedirect('/')
    else:
        login_form = LoginForm()
        register_form = RegisterForm()
        return render(request, 'home.html', {'login_form' : login_form, 'register_form' : register_form})

def log_in(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password =  form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return HttpResponseRedirect('/')

        login_form = LoginForm(request.POST)
        register_form = RegisterForm()
        return render(request, 'home.html', {'login_form' : login_form, 'register_form' : register_form})
    else:
        return HttpResponseRedirect('/')

def log_out(request):
    logout(request)
    return HttpResponseRedirect('/')

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password =  form.cleaned_data['password']
            User.objects.create_user(username=username, password=password)
            return HttpResponseRedirect('/')
        else:
            login_form = LoginForm()
            register_form = RegisterForm(request.POST)
            return render(request, 'home.html', {'login_form' : login_form, 'register_form' : register_form})

    else:
        return HttpResponseRedirect('/')
