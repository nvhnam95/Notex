from django import forms
class LoginForm(forms.Form):
    username = forms.CharField(
        required = True,
        label = 'Username',
        max_length = 32
    )

    password = forms.CharField(
        required = True,
        label = 'Password',
        max_length = 32,
        widget = forms.PasswordInput()
    )
    def clean_username(self):
        username = self.cleaned_data['username']
        if " " in username:
            raise forms.ValidationError("Your username or password are incorrect, please try again.")
        return username

class RegisterForm(forms.Form):
    username = forms.CharField(
        required = True,
        label = 'Username',
        max_length = 32
    )

    password = forms.CharField(
        required = True,
        label = 'Password',
        max_length = 32,
        widget = forms.PasswordInput()
    )

    confirm_password = forms.CharField(
        required = True,
        label = 'Confirm Password',
        max_length = 32,
        widget = forms.PasswordInput()
    )


    def clean(self):
        username = self.cleaned_data['username']
        password =  self.cleaned_data['password']
        confirm_password = self.cleaned_data['confirm_password']

        if password != confirm_password:
            raise forms.ValidationError("Password does not match the confirm password.")

        if (User.objects.filter(username=username).exists()):
            raise forms.ValidationError("Someone took this username, please try another.")

        if " " in password or " " in username:
            raise forms.ValidationError("Username and password cannot contain space.")
  
