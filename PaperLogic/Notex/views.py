from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django import forms
from Notex.forms import LoginForm, RegisterForm

def home(request):
    return render(request, 'home.html')

def log_in(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            userObj = form.cleaned_data
            username = userObj['username']
            password =  userObj['password']
            user = authenticate(username = username, password = password)
            if user:
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                raise forms.ValidationError('The username or password is incorrect, please try again.')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form' : form})

def log_out(request):
    logout(request)
    return HttpResponseRedirect('/')


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            userObj = form.cleaned_data
            username = userObj['username']
            password =  userObj['password']
            confirm_password = userObj['confirm_password']
            if not (User.objects.filter(username=username).exists()):
                User.objects.create_user(username=username, password=password)
                return HttpResponseRedirect('/')
            else:
                raise forms.ValidationError('Looks like a username with that email or password already exists')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form' : form})
