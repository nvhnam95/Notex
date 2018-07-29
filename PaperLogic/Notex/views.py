from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from Notex.forms import LoginForm, RegisterForm
from Notex.models import Note

def home(request):
    first_login = True
    notes = {}
    if request.user.is_authenticated:
        notes = Note.objects.filter(user=request.user.id)

    if request.method == "POST":
        #login_form = LoginForm(method.POST)
        #register_form = RegisterForm(method.POST)
        return HttpResponseRedirect('/')
    else:
        login_form = LoginForm()
        register_form = RegisterForm()
        return render(request, 'home.html', {'login_form' : login_form, 
                                             'register_form' : register_form,
                                             'notes' : notes,
                                             'first_login' : first_login,
        })

def log_in(request):
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            username = login_form.cleaned_data['username']
            password =  login_form.cleaned_data['password']
            user = authenticate(username=username, password=password)
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
            messages.success(request, 'User created successfully, please login.')
            return HttpResponseRedirect('/')
        else:
            login_form = LoginForm()
            register_form = RegisterForm(request.POST)
            register_error = False
            if register_form.errors:
                print (register_form.errors)
                register_error = True
            return render(request, 'home.html', {'login_form' : login_form, 'register_form' : register_form, 'register_error':register_error})
    else:
        return HttpResponseRedirect('/')
