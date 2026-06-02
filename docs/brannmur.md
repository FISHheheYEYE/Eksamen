brannmurregler tillater trafikk fra bedriftens subnett (192.168.1.0/24). den andre trafikk som blir sendt til admin siden blir blokkert.
hvis en sier at admin siden er på en port og nettsiden er på en annen port så blir ip adresser fra subnettet tillat gjennom, men andre iper blir blokkert fra den porten, men begge er lov på nettsiden bare ikke admin siden

akkurat nå har jeg bare noe på nettsiden som skjekker om ipen er lokalhost eller en spesefik ip for å komme inn på admin page, dette er bare for nå frem til ting er satt i gang

ariktektur:
det er webserver som kjører nettsiden og har frontend
database serveren som lagrer data og skal ikke være direkte tilgjeneglig på nett
admin grensesnitt som er tilgjengelig på bedriftens sitt nett og er en kontrollside for ansatte

insternett --> 
webserver container -->
database container -->
admin container

webserver container er åpen
database container er ikke åpen
admin container er ikke åpen med mindre enn er på intern nett

så nettsiden får sin info fra docker container som er koblet til databasen