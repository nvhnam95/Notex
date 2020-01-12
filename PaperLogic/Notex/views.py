import json
from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from Notex.forms import LoginForm, RegisterForm
from Notex.models import Note
from django.views.decorators.csrf import ensure_csrf_cookie

def home(request):
    first_login = True
    notes = {}
    if request.user.is_authenticated:
        notes = Note.objects.filter(user=request.user.id)

    if request.method == "POST":
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
                register_error = True
            return render(request, 'home.html', {'login_form' : login_form, 'register_form' : register_form, 'register_error':register_error})
    else:
        return HttpResponseRedirect('/')

def update_note(request):
    note = Note.objects.get(id=request.POST.get("id"))
    note.content = request.POST.get("content")
    note.created_date =  request.POST.get("date")
    note.background = request.POST.get("background")
    note.save()
    return HttpResponse(content_type="application/json")

def delete_note(request):
    note = Note.objects.get(id=request.POST.get("id"))
    note.delete()
    response_data={}
    return HttpResponse(content_type="application/json")

def create_note(request):
    note = Note()
    note.user = request.user
    note.content = request.POST.get("content")
    note.background = request.POST.get("background")
    note.created_date =  request.POST.get("date")
    note.save()
    id = note.id
    return HttpResponse(id, content_type="application/json")
