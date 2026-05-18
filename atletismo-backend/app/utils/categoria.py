from datetime import date

def calcular_categoria(fecha_nacimiento: date, fecha_referencia: date = None) -> str:
    if not fecha_referencia:
        fecha_referencia = date.today()
    
    edad = fecha_referencia.year - fecha_nacimiento.year
    
    # En atletismo la categoría se calcula por año de nacimiento
    # no por edad exacta el día de hoy
    anio_nacimiento = fecha_nacimiento.year
    anio_actual = fecha_referencia.year
    edad_en_anio = anio_actual - anio_nacimiento

    if edad_en_anio <= 7:   return "u8"
    if edad_en_anio <= 9:   return "u10"
    if edad_en_anio <= 11:  return "u12"
    if edad_en_anio <= 13:  return "u14"
    if edad_en_anio <= 15:  return "u16"
    if edad_en_anio <= 17:  return "u18"
    if edad_en_anio <= 19:  return "u20"
    if edad_en_anio <= 22:  return "u23"
    if edad_en_anio >= 35:  return "master"
    return "adulto"