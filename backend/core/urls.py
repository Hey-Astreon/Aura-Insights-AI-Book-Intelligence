from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.http import HttpResponse

def root_redirect(request):
    return HttpResponse("""
        <div style='font-family: sans-serif; text-align: center; margin-top: 50px;'>
            <h1>🚀 AuraInsights API is Online</h1>
            <p>The backend is running successfully.</p>
            <p><a href='/api/books/'>View API Endpoints</a> | <a href='http://localhost:3000'>Go to Frontend</a></p>
        </div>
    """)

urlpatterns = [
    path('', root_redirect),
    path('admin/', admin.site.urls),
    path('api/', include('books.urls')),
]
