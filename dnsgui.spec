Name:		dnsgui
Version:	1.0.0	
Release:	1%{?dist}
BuildArch:	noarch
Summary:	A web based management tool for bind	
Group: 		System Environment/Base
License:	GPLv2+
URL:		https://github.com/varesa/dnsgui
Source0: 	%{name}-%{version}.tar.gz

Requires: httpd mod_wsgi

%description

%prep
%autosetup

%build

%install
install -m 644 -D config/httpd.confd %{buildroot}/etc/httpd/conf.d/dnsgui.conf
install -m 644 -D config/sudoers.confd %{buildroot}/etc/sudoers.d/dnsgui.conf

install -m 755 -d %{buildroot}/var/www/dnsgui
find ./ -name "*.py" -exec install -m 644 {} %{buildroot}/var/www/dnsgui/{} \;
install -m 755 -d %{buildroot}/var/www/dnsgui/static
find static/ -type d -exec install -m 755 -d {} %{buildroot}/var/www/dnsgui/{} \;
find static/ -type f -exec install -m 644 {} %{buildroot}/var/www/dnsgui/{} \;

%files
/etc/*
/var/*

%changelog
