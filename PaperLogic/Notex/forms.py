from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    username = forms.CharField(
        required = True,
        label = 'Username',
        max_length = 32,
        widget=forms.TextInput(attrs={'class':'form-control'})
    )

    password = forms.CharField(
        required = True,
        label = 'Password',
        max_length = 32,
        widget=forms.PasswordInput(attrs={'id': 'input_password_login','class':'form-control'})
    )
    
    def clean(self):
        username = self.cleaned_data['username']
        password =  self.cleaned_data['password']
        user = authenticate(username=username, password=password)
        if not user:
            raise forms.ValidationError("Your username or password are incorrect.")

class RegisterForm(forms.Form):
    username = forms.CharField(
        required = True,
        label = 'Username',
        max_length = 32,
        widget=forms.TextInput(attrs={'id': 'input_password_register','class':'form-control'})
    )

    password = forms.CharField(
        required = True,
        label = 'Password',
        max_length = 32,
        widget = forms.PasswordInput(attrs={'class':'form-control'})
    )

    confirm_password = forms.CharField(
        required = True,
        label = 'Confirm Password',
        max_length = 32,
        widget = forms.PasswordInput(attrs={'class':'form-control'})
    )

    def clean(self):
        username = self.cleaned_data['username']
        password =  self.cleaned_data['password']
        confirm_password = self.cleaned_data['confirm_password']

        if password != confirm_password:
            raise forms.ValidationError("Passwords didn't match.")

        if (User.objects.filter(username=username).exists()):
            raise forms.ValidationError("Someone took this username, please try another.")

        if " " in password or " " in username:
            raise forms.ValidationError("Username and password cannot contain space.")

        if len(password) < 6:
            raise forms.ValidationError("Your password is too short.")

        if len(username) < 6:
            raise forms.ValidationError("Your username is too short.")
  