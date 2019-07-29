zip:
	zip -0 build/f1-tv-enhanced.zip -r . -x@exclude.lst

clean:
	rm build/f1-tv-enhanced.zip

.PHONY: clean
