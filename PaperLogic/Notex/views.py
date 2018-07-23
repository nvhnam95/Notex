from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render


def login(request):
    #template = loader.get_template('Notex/login.html')
    return render(request, 'Notex/login.html')

def create_note(request):
    return HttpResponse("You are about to creating notes.")

def view_note(request):
    return HttpResponse("We cannot show you any note..")